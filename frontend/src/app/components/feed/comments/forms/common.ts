import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";

@Component({
  selector: '',
  template: '',
})
export class Common {  // it is base class, so it should not be defined in any angular modules
  text: string = '';
  showCaret: boolean = false;
  caretOffset: number = 0;
  @ViewChild('mainInputElement') mainInput!: ElementRef<HTMLInputElement>; // child classes must override this

  setCaretPosition(): void {
    const position: number = this.mainInput.nativeElement.selectionStart as number;
    this.caretOffset = this.text.length - position;
  }

  @HostListener('document:keydown', ['$event'])
  keydown(event: KeyboardEvent): void {
    setTimeout(this.setCaretPosition.bind(this), 10);
  }

  @HostListener('document:keyup', ['$event'])
  keyup(event: KeyboardEvent): void {
    setTimeout(this.setCaretPosition.bind(this), 10);
  }

  constructor() {
    setInterval(() => this.showCaret = !this.showCaret, 700);
  }

  clear(): void {
    this.text = '';
  }
}
