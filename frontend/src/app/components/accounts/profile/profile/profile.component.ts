import { Component, OnInit } from '@angular/core';
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";
import { serverUrl } from "../../../../constants";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  protected readonly serverUrl: string = serverUrl;
  user: User | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    if (!this.accountService.userProfile.value) {
      this.accountService.updateUserProfile();
    }
    this.accountService.userProfile.subscribe((value: User | null): void => {
      this.user = value;
    })
  }
}
