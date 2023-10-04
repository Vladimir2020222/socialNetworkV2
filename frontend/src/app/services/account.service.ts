import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { serverUrl } from "../constants";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userProfile: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  updateIsLoggedIn(): void {
    this.http.get<boolean>(serverUrl + 'accounts/is_authenticated', {withCredentials: true})
      .subscribe((value: boolean): void => {
        this.isLoggedIn.next(value);
      })
  }

  updateUserProfile(): void {
    if (!this.isLoggedIn) {
      this.userProfile.next(null);
    }
    this.http.get<User | null>(serverUrl + 'accounts/profile', {withCredentials: true})
      .subscribe((value: User | null): void => {
        this.userProfile.next(value);
      })
  }

  logout(): void {
    this.http.post(serverUrl + 'accounts/logout', null, {withCredentials: true})
      .subscribe(value => {});
  }

  login({username, password}: {username: string, password: string}): void {
    this.http.post<User>(
      serverUrl + 'accounts/login',
      JSON.stringify({username: username, password: password}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    }).subscribe(user => {this.userProfile.next(user)})
  }

  signup(
    {username, password, firstName, lastName}:
      {username: string, password: string, firstName: string, lastName: string}
  ): void {
    this.http.post<User>(
      serverUrl + 'accounts/signup',
      JSON.stringify({username: username, password: password, first_name: firstName, last_name: lastName}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(user => {this.userProfile.next(user)})
  }

  changeUserProfile(data: Partial<User>): void {
    this.http.patch<User>(
      serverUrl + 'accounts/profile',
      JSON.stringify(data),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(user => {this.userProfile.next(user)})
  }

  changeAva(file: File): void {
    const formData: FormData = new FormData();
    formData.append('ava', file, file.name);
    this.http.patch<User>(serverUrl + 'accounts/profile',
      formData,
      {
        withCredentials: true
      }).subscribe(user => {this.userProfile.next(user)})
  }
}
