import { Component, OnInit } from '@angular/core';
import { ActivationStart, Data, Router } from "@angular/router";
import { ThemesEnum } from 'src/app/enums/themes'
import { Theme } from "./interface/theme.module";
import { themes } from "./constants";
import { CommonService } from "./services/common.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  useMainContentWrapper: boolean = false;

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    this.setUseMainContentWrapper();
    this.setTheme();
    this.setTimezone();
  }

  setUseMainContentWrapper(): void {
    this.router.events.subscribe((data): void => {
      if (data instanceof ActivationStart) {
        const d: Data = data.snapshot.data;
        if (d.hasOwnProperty('useMainContentWrapper')) {
          this.useMainContentWrapper = d['useMainContentWrapper'];
        }
      }
    });
  }

  setTheme(): void {
    let localStorageTheme: string | null = localStorage.getItem('theme');
    if (!localStorageTheme) {
      localStorageTheme = String(ThemesEnum.dark);
      localStorage.setItem('theme', localStorageTheme);
    }
    const theme: Theme = themes[
      ThemesEnum[
        Number(localStorageTheme)
        ]
    ];
    Object.entries(theme).forEach((pair: [string, string]): void => {
      const [key, value] = pair;
      document.documentElement.style.setProperty('--' + key, value);
    })
  }

  setTimezone(): void {
    let lastTimezone: string | null = localStorage.getItem('timezone');
    let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (lastTimezone != currentTimezone) {
      this.commonService.setTimezone(currentTimezone)
        .subscribe(_ => localStorage.setItem('timezone', currentTimezone));
    }
  }
}
