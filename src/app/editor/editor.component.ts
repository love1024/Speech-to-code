import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { EditorActions, IEditorAction } from '../model';

declare const CodeMirror;
declare const js_beautify;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  codeMirror: any;
  arguments = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  output = '';

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    const textarea = document.getElementById('editor');
    const codeMirror = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      gutter: true,
      mode: "javascript",
      styleActiveLine: true
    });
    this.codeMirror = codeMirror;

    this.addLines();
    this.lisenToAction();
  }

  lisenToAction(): void {
    this.appService.getEditorActionEmitter().subscribe((action: IEditorAction) => {
      console.log(action);
      switch (action.action) {
        case EditorActions.GO_TO_LINE:
          this.goToLine(+action.value[0].value);
          break;
        case EditorActions.CREATE_FUNCTION:
          this.createFunction(action.value[0].value, +action.value[1].value);
          break;
        case EditorActions.UNDO:
          this.undo();
          break;
        case EditorActions.CREATE_VARIABLE:
          this.createVariable(
            action.value[0].value,
            action.value.length > 1 ? action.value[1].value : null,
            action.value.length > 2 ? action.value[2].value : null);
          break;
        case EditorActions.RETURN:
          this.return(action.value.length > 0 ? action.value[0].value : null);
          break;
        case EditorActions.RUN_CODE:
          this.runCode();
          break;
        case EditorActions.LOG_CODE:
          this.logCode(action.value[0].value, action.value.length > 1 ? action.value[1].value : null);
          break;
        case EditorActions.CALL_FUNCTION:
          this.callFunction(action.value[0].value, action.value[1].value);
          break;
      }
    });
  }

  undo(): void {
    if (this.codeMirror) {
      this.codeMirror.undo();
    }
  }

  goToLine(lineNumber: number): void {
    if (this.codeMirror) {
      this.codeMirror.setCursor(lineNumber - 1);
    }
  }

  runCode(): void {
    if (this.codeMirror) {
      const code = this.codeMirror.getValue();
      setTimeout(async () => {
        this.output = await this.runThisCode(code);
      });
    }
  }

  logCode(expression: string, type: string): void {
    if (this.codeMirror) {
      const cursor = this.codeMirror.getCursor();
      let log = "";
      if (type == "string") {
        log = `console.log("${expression}");`;
      } else {
        log = `console.log(${expression});`;
      }
      this.codeMirror.replaceRange(
        log,
        { line: cursor.line, ch: 0 },
        { line: cursor.line, ch: this.codeMirror.getLine(cursor.line).length });
      this.codeMirror.indentLine(cursor.line);
      this.codeMirror.execCommand('newlineAndIndent')
    }
  }

  callFunction(name: string, args: string) {
    if (this.codeMirror) {
      args = args.replace(/and/, '');
      args = args.replace(/\s/, '');
      args = args.split(" ").join(',');
      const cursor = this.codeMirror.getCursor();
      this.codeMirror.replaceRange(
        `${name}(${args});`,
        { line: cursor.line, ch: 0 },
        { line: cursor.line, ch: this.codeMirror.getLine(cursor.line).length });
      this.codeMirror.indentLine(cursor.line);
      this.codeMirror.execCommand('newlineAndIndent')
    }
  }

  createVariable(name: string, value?: string, type?: string) {
    if (this.codeMirror) {
      if (this.codeMirror.getLine(this.codeMirror.getCursor().line)) {
        this.goToLine(this.codeMirror.getCursor().line + 2);
      }
      const cursor = this.codeMirror.getCursor();
      if (type && type == "number") {
        this.codeMirror.replaceRange(
          `let ${name}${value ? ` = ${value}` : ""};`,
          { line: cursor.line, ch: 0 },
          { line: cursor.line, ch: this.codeMirror.getLine(cursor.line).length });
      } else {
        this.codeMirror.replaceRange(`let ${name}${value ? ` = "${value}"` : ""};`,
          { line: cursor.line, ch: 0 },
          { line: cursor.line, ch: this.codeMirror.getLine(cursor.line).length });
      }
      this.codeMirror.execCommand('newlineAndIndent')
    }
    // this.beautify();
  }

  createFunction(name: string, totalArguments: number): void {
    if (this.codeMirror) {
      let args = '';
      for (let i = 0; i < totalArguments; i++) {
        args += this.arguments[i] + (i == totalArguments - 1 ? "" : ",");
      }
      const text = `function ${name}(${args}) {

}`;
      if (this.codeMirror.getSelection().length > 0) {
        const sel = this.codeMirror.listSelections()[0]
        this.codeMirror.replaceSelection(text)
        this.codeMirror.setSelection(sel.anchor, { ...sel.head, ch: sel.anchor.ch + text.length })
      } else {
        this.codeMirror.replaceRange(text, this.codeMirror.getCursor())
      }

      // this.beautify();
    }
  }

  return(value: string) {
    if (this.codeMirror) {
      this.codeMirror.replaceRange(`return${value ? ` ${value}` : ""};`, this.codeMirror.getCursor());
      this.beautify();
    }
  }

  beautify(): void {
    if (this.codeMirror) {
      let curLine = this.codeMirror.getCursor().line;
      this.codeMirror.setValue(js_beautify(this.codeMirror.getValue()));
      this.codeMirror.setCursor(curLine);
    }
  }

  private addLines(): void {
    var minLines = 10;
    var startingValue = '';
    for (var i = 0; i < minLines; i++) {
      startingValue += '\n';
    }
    this.codeMirror.setValue(startingValue);
  }

  private runThisCode(code: string) {
    return new Promise<string>((res, rej) => {
      try {
        // eslint-disable-next-line no-eval
        eval(`
                console.defaultLog = console.log.bind(console);
                console.logs = [];
                console.log = function() {
                    console.defaultLog.apply(console, arguments);
                    console.logs.push(Array.from(arguments));
                }

                ${code}
            `)

        const text = console['logs'].map(item => item.join(' ')).join('\n')

        setTimeout(() => res(text), 1500)
      } catch (ex) {
        setTimeout(() => rej(ex.toString()), 1500)
      } finally {
        if (console['defaultLog']) {
          console.log = console['defaultLog'].bind(console)
          delete console['defaultLog']
        }

        delete console['logs']
      }
    })
  }
}
