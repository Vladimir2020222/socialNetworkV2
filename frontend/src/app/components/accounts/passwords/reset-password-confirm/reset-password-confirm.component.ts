import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css', '../../forms.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
  token!: string;
  uid!: string;
  passwordMatches: boolean = true;

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') as string;
    this.uid = this.route.snapshot.paramMap.get('uid') as string;
  }

  submit(password: string, passwordVerification: string): void {
    if (password !== passwordVerification) {
      this.passwordMatches = false;
      return;
    }
    this.accountService.confirmResetPassword(this.token, password, this.uid);
  }
}
