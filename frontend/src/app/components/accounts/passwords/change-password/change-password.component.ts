import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css', '../../../forms.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  passwordMatches: boolean = true;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(''),
      newPassword: new FormControl('')
    })
  }

  submit(passwordVerification: string): void {
    const data: {oldPassword: string, newPassword: string} = this.changePasswordForm.value;
    if (passwordVerification !== data.newPassword) {
      this.passwordMatches = false;
      return;
    }
    this.accountService.changePassword(data);
    this.router.navigate(['accounts/profile']);
  }
}
