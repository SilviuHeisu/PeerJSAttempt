import { NgModule } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CallService } from './call.service';
import { VideoCallComponent } from './video-call/video-call.component';

@NgModule({
  declarations: [AppComponent, VideoCallComponent],
  imports: [BrowserModule, MatSnackBarModule],
  providers: [CallService],
  bootstrap: [AppComponent],
})
export class AppModule {}
