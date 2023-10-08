import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-confirm-change-email',
  templateUrl: './confirm-change-email.component.html',
  styleUrls: ['./confirm-change-email.component.css']
})
export class ConfirmChangeEmailComponent implements OnInit {
  token: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.submit()
  }

  submit(): void {
    if (this.token) {
      this.accountService.confirmChangeEmail(this.token);
    }
    this.router.navigate(['accounts/profile']);
  }
}
