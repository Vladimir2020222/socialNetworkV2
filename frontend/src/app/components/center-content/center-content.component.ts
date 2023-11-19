import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-center-content',
  templateUrl: './center-content.component.html',
  styleUrls: ['./center-content.component.css']
})
export class CenterContentComponent implements OnInit {
  @ViewChild('centerDiv') centerDiv: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('centerDivWrapper') centerDivWrapper: ElementRef<HTMLDivElement> | undefined;
  @Input() useInterval: boolean = false;
  @Input() time: number = 100;

  ngOnInit(): void {
    const handler = (): void => {
      if (this.centerDiv) {
        height = getComputedStyle(this.centerDiv.nativeElement).height;
        this.centerDivWrapper!.nativeElement.style.height = height;
      }
    }
    let height: string | undefined;
    (this.useInterval? setInterval : setTimeout)(handler, this.time)
  }
}
