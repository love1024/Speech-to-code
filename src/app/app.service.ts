import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IEditorAction } from './model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private transriptEmitter: Subject<string> = new Subject();
  private editorActionEmitter: Subject<IEditorAction> = new Subject();
  private responseEmitter: Subject<string> = new Subject();
  private completeIntentEmitter: Subject<string> = new Subject();

  constructor() { }

  emitTranscript(transcript: string): void {
    this.transriptEmitter.next(transcript);
  }

  getTranscriptEmitter(): Subject<string> {
    return this.transriptEmitter;
  }

  emitResponse(response: string): void {
    this.responseEmitter.next(response);
  }

  getResponseEmitter(): Subject<string> {
    return this.responseEmitter;
  }

  emitCompleteIntentEmitter(message: string): void {
    this.completeIntentEmitter.next(message);
  }

  getCompleteIntentEmitter(): Subject<string> {
    return this.completeIntentEmitter;
  }

  emitEditorAction(action: IEditorAction): void {
    this.editorActionEmitter.next(action);
  }

  getEditorActionEmitter(): Subject<IEditorAction> {
    return this.editorActionEmitter;
  }
}
