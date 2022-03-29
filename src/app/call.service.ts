import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';

@Injectable()
export class CallService {
  private peer: Peer = new Peer();
  private mediaCall!: Peer.MediaConnection;
  private localStreamBs!: BehaviorSubject<MediaStream>;
  // public localStream$ = this.localStreamBs.asObservable();
  public localStream$: any = null;
  private remoteStreamBs!: BehaviorSubject<MediaStream>;

  // public remoteStream$ = this.remoteStreamBs.asObservable();
  public remoteStream$: any = null;
  private isCallStartedBs = new Subject<boolean>();
  // public isCallStarted$ = this.isCallStartedBs.asObservable();
  public isCallStarted$: any = null;
  constructor(private snackBar: MatSnackBar) {
    this.localStream$ = this.localStreamBs.asObservable();
    this.isCallStarted$ = this.isCallStartedBs.asObservable();
    this.remoteStream$ = this.remoteStreamBs.asObservable();
  }
  public initPeer() {
    if (!this.peer || this.peer.disconnected) {
      const peerJsOptions: Peer.PeerJSOption = {
        debug: 3,
        config: {
          iceServers: [
            {
              urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
              ],
            },
          ],
        },
      };
      try {
        let id = uuidv4();
        this.peer = new Peer(id, peerJsOptions);
        return id;
      } catch (error) {
        console.error(error);
      }
    }
    return 0;
  }
  public async establishMediaCall(remotePeerId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const connection = this.peer.connect(remotePeerId);
      connection.on('error', (err: any) => {
        console.error(err);
        this.snackBar.open(err, 'Close');
      });
      this.mediaCall = this.peer.call(remotePeerId, stream);
      if (!this.mediaCall) {
        let errorMessage = 'Unable to connect to remote peer';
        this.snackBar.open(errorMessage, 'Close');
        throw new Error(errorMessage);
      }
      this.localStreamBs.next(stream);
      this.localStream$ = this.localStreamBs.asObservable();
      this.isCallStartedBs.next(true);
      this.mediaCall.on('stream', (remoteStream: any) => {
        this.remoteStreamBs.next(remoteStream);
        this.remoteStream$ = this.remoteStreamBs.asObservable();
      });
      this.mediaCall.on('error', (err: any) => {
        this.snackBar.open(err, 'Close');
        console.error(err);
        this.isCallStartedBs.next(false);
        this.isCallStarted$ = this.isCallStartedBs.asObservable();
      });
      this.mediaCall.on('close', () => this.onCallClose());
    } catch (ex: any) {
      console.error(ex);
      this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }
  public async enableCallAnswer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localStreamBs.next(stream);
      this.peer.on('call', async (call: Peer.MediaConnection) => {
        this.mediaCall = call;
        this.isCallStartedBs.next(true);
        this.mediaCall.answer(stream);
        this.mediaCall.on('stream', (remoteStream: any) => {
          this.remoteStreamBs.next(remoteStream);
        });
        this.mediaCall.on('error', (err: string) => {
          this.snackBar.open(err, 'Close');
          this.isCallStartedBs.next(false);
          console.error(err);
        });
        this.mediaCall.on('close', () => this.onCallClose());
      });
    } catch (ex: any) {
      console.error(ex);
      this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }
  private onCallClose() {
    this.remoteStreamBs?.value.getTracks().forEach((track) => {
      track.stop();
    });
    this.localStreamBs?.value.getTracks().forEach((track) => {
      track.stop();
    });
    this.snackBar.open('Call Ended', 'Close');
  }
  public closeMediaCall() {
    this.mediaCall?.close();
    if (!this.mediaCall) {
      this.onCallClose();
    }
    this.isCallStartedBs.next(false);
  }
  public destroyPeer() {
    this.mediaCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }
}
