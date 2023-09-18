import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private serverUrl = 'http://127.0.0.1:8000/';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userProfile: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  updateIsLoggedIn(): void {
    this.http.get<boolean>(this.serverUrl + 'accounts/is_authenticated/', {withCredentials: true})
      .subscribe((value: boolean): void => {
        this.isLoggedIn.next(value);
      })
  }

  updateUserProfile(): void {
    if (!this.isLoggedIn) {
      this.userProfile.next(null);
    }
    this.http.get<User | null>(this.serverUrl + 'accounts/profile/', {withCredentials: true})
      .subscribe((value: User | null): void => {
        this.userProfile.next(value);
      })
  }

  logout(): void {
    this.http.post(this.serverUrl + 'accounts/logout/', null, {withCredentials: true});
  }

  login(username: string, password: string): void {
    this.http.post(
      this.serverUrl + 'accounts/login/',
      JSON.stringify({username: username, password: password}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    })
  }

  signup(username: string, password: string, firstName: string, secondName: string): void {
    this.http.post(
      this.serverUrl + 'accounts/signup/',
      JSON.stringify({username: username, password: password, first_name: firstName, second_name: secondName}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )
  }
}
