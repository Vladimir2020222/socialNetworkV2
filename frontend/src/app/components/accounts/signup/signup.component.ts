import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { AccountService } from "../../../services/account.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../forms.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordMatches: boolean = true;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password: new FormControl('')
    });
  }

  submit(passwordVerification: string): void {
    const data: {username: string, firstName: string, lastName: string, password: string} = this.signupForm.value;
    if (passwordVerification !== data.password) {
      this.passwordMatches = false;
      return;
    }
    this.accountService.signup(data);
    this.router.navigate(['accounts/profile']);
  }
}
