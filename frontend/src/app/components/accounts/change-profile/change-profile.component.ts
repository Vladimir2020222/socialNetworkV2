import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../services/account.service";
import { FormControl, FormGroup } from "@angular/forms";
import { User } from "../../../models/user";
import { Router } from "@angular/router";

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css', '../../forms.css']
})
export class ChangeProfileComponent implements OnInit {
  changeProfileForm!: FormGroup;
  user: User | null = null;

  constructor(private accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.changeProfileForm = new FormGroup(
      {
        username: new FormControl(this.user?.username || ''),
        firstName: new FormControl(this.user?.firstName || ''),
        lastName: new FormControl(this.user?.lastName || ''),
        email: new FormControl(this.user?.email || ''),
      }
    )
    this.subscribeToUserProfile();
  }

  subscribeToUserProfile(): void {
    this.accountService.userProfile.subscribe(user => {
      this.user = user;
      this.changeProfileForm.setValue({
        username: user?.username || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
      })
    })
    this.accountService.updateUserProfile();
  }

  submit(): void {
    const data: Partial<User> = this.changeProfileForm.value;
    if (this.user?.email !== this.changeProfileForm.value['email']) {
      this.accountService.changeEmail(this.changeProfileForm.value['email'])
    }
    this.accountService.changeUserProfile(data);
    this.router.navigate(['accounts/profile']);
  }
}
