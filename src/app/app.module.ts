import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InstructionComponent } from './instruction/instruction.component';
import { EditorComponent } from './editor/editor.component';
import { AssistantComponent } from './assistant/assistant.component';

@NgModule({
  declarations: [
    AppComponent,
    InstructionComponent,
    EditorComponent,
    AssistantComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
