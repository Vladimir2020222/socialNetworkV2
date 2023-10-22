import { Component, Input } from '@angular/core';
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";

@Component({
  selector: 'app-profile-subscribe-button',
  templateUrl: './profile-subscribe-button.component.html',
  styleUrls: ['./profile-subscribe-button.component.css']
})
export class ProfileSubscribeButtonComponent {
  @Input() user!: User;
  isSubscribed: boolean | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.userProfile
      .subscribe((currentUser: User | null): void => {
        if (currentUser?.pk !== this.user.pk) {
          this.accountService.isSubscribedTo(this.user.pk)
            .subscribe((isSubscribed: boolean): void => {
              this.isSubscribed = isSubscribed
            });
        }
      });
  }

  click(): void {
    if (this.isSubscribed) {
      this.accountService.unsubscribe(this.user.pk)
    } else {
      this.accountService.subscribe(this.user.pk);
    }
    this.isSubscribed = !this.isSubscribed;
  }
}
