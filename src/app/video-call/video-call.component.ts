import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, filter, switchMap, of } from 'rxjs';
import { CallService } from '../call.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  CallinfoDialogComponent,
  DialogData,
} from '../callinfo-dialog/callinfo-dialog.component';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit {
  public isCallStarted$: Observable<boolean>;
  private peerId: string = '';
  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private callService: CallService,

    public dialog: MatDialog
  ) {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer() || '';
  }
  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter((res) => !!res))
      .subscribe(
        (stream: any) => (this.localVideo.nativeElement.srcObject = stream)
      );
    this.callService.remoteStream$
      .pipe(filter((res) => !!res))
      .subscribe(
        (stream: any) => (this.remoteVideo.nativeElement.srcObject = stream)
      );
  }
  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }
  public showModal(joinCall: boolean): void {
    let dialogData: DialogData = joinCall
      ? { peerId: '', joinCall: true }
      : { peerId: this.peerId, joinCall: false };
    const dialogRef = this.dialog.open(CallinfoDialogComponent, {
      width: '250px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((peerId) =>
          joinCall
            ? of(this.callService.establishMediaCall(peerId))
            : of(this.callService.enableCallAnswer())
        )
      )
      .subscribe((_) => {});
  }

  public endCall() {
    this.callService.closeMediaCall();
  }
}
