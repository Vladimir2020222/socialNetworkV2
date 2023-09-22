import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-center-content',
  templateUrl: './center-content.component.html',
  styleUrls: ['./center-content.component.css']
})
export class CenterContentComponent implements OnInit {
  @ViewChild('centerDiv') centerDiv: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('centerDivWrapper') centerDivWrapper: ElementRef<HTMLDivElement> | undefined;

  ngOnInit(): void {
    let height: string | undefined;
    const timeout: number = setTimeout((): void => {
      if (this.centerDiv) {
        height = getComputedStyle(this.centerDiv.nativeElement).height;
        clearTimeout(timeout);
        this.centerDivWrapper!.nativeElement.style.height = height;
      }
    }, 100)
  }
}
