import { Inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-callinfo-dialog',
  templateUrl: './callinfo-dialog.component.html',
  styleUrls: ['./callinfo-dialog.component.css'],
})
export class CallinfoDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CallinfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public showCopiedSnackBar() {
    this._snackBar.open('Peer ID Copied!', 'Hurrah', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

export interface DialogData {
  peerId?: string;
  joinCall: boolean;
}
