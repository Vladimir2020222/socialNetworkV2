import { Component } from '@angular/core';
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private accountService: AccountService) {}

  logout(): void {
    this.accountService.logout()
  }
}
