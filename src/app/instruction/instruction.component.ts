import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';
import { EditorActions, IIntent } from '../model';
import { speechData } from '../speechdata';
import { SpeechRecognizerService } from '../web-speech/services/speech-recognizer.service';

declare const spoken;

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit {
  data: IIntent[] = speechData;
  current = 0;

  constructor(private appService: AppService, private speechService: SpeechRecognizerService) {

  }

  ngOnInit(): void {
    this.listenToTranscript();
  }

  listenToTranscript(): void {
    this.appService.getTranscriptEmitter().subscribe((transcript: string) => {
      let abort = false;
      let anyMatch = false;
      transcript = transcript.toLocaleLowerCase();
      transcript = this.wordToNum(transcript);
      this.data.forEach(async (value, i) => {
        if (abort) return;
        const reg = new RegExp(value.regex);
        const match = transcript.match(reg);
        if (match) {
          anyMatch = true;
          this.current = i;
          this.appService.emitCompleteIntentEmitter(transcript);
          const done = await this.checkForSlots(value, match);
          if (done) {
            let answer = value.response[this.getRandomInt(value.response.length)];
            console.log(answer);
            console.log(value.response);
            value.slots.forEach((i) => {
              answer = answer.replace(`{{${i.name}}}`, i.value);
            });
            await spoken.say(answer, "Microsoft Zira - English (United States)");
            this.appService.emitEditorAction({ action: EditorActions[value.action], value: value.slots });
            this.appService.emitResponse(answer);
          } else {
            await spoken.say("Sorry, I didn't get it, please try again", "Microsoft Zira - English (United States)");
            this.appService.emitResponse("Sorry, please try again");
            abort = true;
          }
        }
      });

      if (!anyMatch) {
        this.searchForNearest(transcript);
      }
    })
  }

  async checkForSlots(intent: IIntent, match: RegExpMatchArray): Promise<boolean> {
    for (let i = 0; i < intent.slots.length; i++) {
      if ((!match.groups || !match.groups[intent.slots[i].name]) && !intent.slots[i].optional) {
        const messageToSay = intent.slots[i].question[this.getRandomInt(intent.slots[i].question.length)];
        await spoken.say(messageToSay, "Microsoft Zira - English (United States)");
        this.appService.emitResponse(messageToSay);

        const sentence = await spoken.listen();
        const intentReg = new RegExp(intent.slots[i].regex);
        const intentMatch = sentence.match(intentReg);

        this.speechService.start();
        if (intentMatch) {
          intent.slots[i].value = intentMatch[0];
          this.appService.emitCompleteIntentEmitter(sentence);
        } else {
          return false;
        }
      } else {
        intent.slots[i].value = match.groups[intent.slots[i].name];
      }
    }
    return true;
  }

  onPrevClick(): void {
    this.current = (this.current - 1) % this.data.length;
  }

  onNextClick(): void {
    this.current = (this.current + 1) % this.data.length;
  }

  wordToNum(sentence: string): string {
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

    words.forEach((word, i) => {
      const reg = new RegExp(word, "ig");
      sentence = sentence.replace(reg, i.toString());
    });

    return sentence;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  async searchForNearest(transcript: string): Promise<void> {
    let nearest = "";
    let maxCosine = 0.5;
    this.data.forEach(async (value, i) => {
      const cos = this.similarity(transcript, value.base);
      if (cos > maxCosine) {
        maxCosine = cos;
        nearest = value.base;
      }
    })

    if (nearest) {
      this.appService.emitCompleteIntentEmitter(transcript);
      await spoken.say("Did you mean " + nearest, "Microsoft Zira - English (United States)");
      this.appService.emitResponse("Did you mean " + nearest);
      const sentence = await spoken.listen();
      console.log(sentence);
      const intentReg = new RegExp("(yes|ya|yep)");
      const intentMatch = sentence.match(intentReg);
      if (intentMatch) {
        this.appService.emitTranscript(nearest);
      } else {
        await spoken.say("Okay, please try again", "Microsoft Zira - English (United States)");
      }
      this.speechService.start();
    }
  }

  similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
