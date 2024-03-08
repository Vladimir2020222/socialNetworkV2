import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";
import { FeedService } from "../../../../services/feed.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() user!: User | null;
  userIsCurrentUser: boolean = true;  // if it would be false by default, ProfileSubscribeButtonComponents would send
                                      // redundant request to server to check if current user is subscribed to this user
  constructor(private accountService: AccountService, private feedService: FeedService) {}

  ngOnInit(): void {
    this.accountService.userIsInitialized
      .subscribe(value => {
        if (value) {
          this.setUserIsCurrentUser();
        }
      })
  }

  setUserIsCurrentUser(): void {
    this.accountService.userProfile
      .subscribe((currentUserProfile: User | null): void => {
        if (currentUserProfile && this.user) {
          this.userIsCurrentUser = currentUserProfile?.pk === this.user.pk
        } // else element is not necessary because the userIsCurrentUser field is already false by default
      })
  }
}
