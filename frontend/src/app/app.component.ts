import { Component } from '@angular/core';
import { ActivatedRoute, Data } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  useMainContentWrapper: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: Data): void => {
      if (data.hasOwnProperty('useMainContentWrapper')) {
        this.useMainContentWrapper = data['useMainContentWrapper'];
      }
    })
  }
}
