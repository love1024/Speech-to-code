import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from '../app.service';
import { SpeechRecognizerService } from '../web-speech/services/speech-recognizer.service';
import { map, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { SpeechNotification } from '../web-speech/model/speech-notification';
import { SpeechEvent } from '../web-speech/model/speech-event';
import { SpeechError } from '../web-speech/model/speech-error';

declare const spoken;

interface IHistory {
  message: string;
  response: boolean;
}

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit {
  transcript$?: Observable<string>;
  totalTranscript?: string;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();
  history: IHistory[] = [];

  constructor(
    private appService: AppService,
    private speechRecognizer: SpeechRecognizerService) { }

  ngOnInit(): void {
    const webSpeechReady = this.speechRecognizer.initialize();
    if (webSpeechReady) {
      this.initRecognition();
    }
    this.appService.getResponseEmitter().subscribe((response) => {
      this.history.push({ message: response, response: true });
      this.scrollDown();
    });
    this.appService.getCompleteIntentEmitter().subscribe((message) => {
      this.history.push({ message: message, response: false });
      this.scrollDown();
    });
  }

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(map((notification) => notification.event === SpeechEvent.Start));

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case SpeechError.NoSpeech:
            message = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.AudioCapture:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  private processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      this.appService.emitTranscript(message);
    }
  }

  private scrollDown(): void {
    const objDiv = document.getElementById("history");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}
