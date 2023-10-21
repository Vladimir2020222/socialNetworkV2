import { Component, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-current-user-profile',
  templateUrl: './current-user-profile.component.html',
  styleUrls: ['./current-user-profile.component.css']
})
export class CurrentUserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.userProfile
      .subscribe(
        (user: User | null): void => {this.user = user}
      )
  }
}
