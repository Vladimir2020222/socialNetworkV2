import { Component } from '@angular/core';
import { AccountService } from "../../../../services/account.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../forms.css']
})
export class ResetPasswordComponent {
  constructor(private accountService: AccountService) {}

  submit(email: string): void {
    this.accountService.resetPassword(email);
  }
}
