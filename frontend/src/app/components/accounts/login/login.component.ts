import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { AccountService } from "../../../services/account.service";
import { Router } from "@angular/router";
import {User} from "../../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../forms.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })
  }

  submit(): void {
    this.accountService.login(this.loginForm.value)
      .subscribe(
        (user: User): void => {this.router.navigate(['accounts/profile'])}
      );
  }
}
