import {Component, Input, OnInit} from '@angular/core';
import {NavigationMenuOptionData} from "../../../interface/navigation-menu-option-data";
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-navigation-menu-option',
  templateUrl: './navigation-menu-option.component.html',
  styleUrls: ['./navigation-menu-option.component.css']
})
export class NavigationMenuOptionComponent implements OnInit {
  @Input() optionData!: NavigationMenuOptionData;
  shouldRender!: boolean;

  constructor(private accountService: AccountService) {  }

  ngOnInit(): void {
    if (this.optionData.ifLoggedIn === undefined) {
      this.shouldRender = true;
      return;
    }
    this.accountService.updateIsLoggedIn();
    this.accountService.isLoggedIn.subscribe(
      (isLoggedIn: boolean): void => {
        this.shouldRender = isLoggedIn === this.optionData.ifLoggedIn;
      }
    );
  }
}
