import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { User } from "../models/user";
import { serverUrl } from "../constants";
import { usersCache } from "../cache/users-cache";



// class TestBehaviorSubject<T> extends BehaviorSubject<T> {
//   override next(value: T): void {
//     super.next(value);
//     console.log('THE NEXT VALUE IS', value)
//   }
// }


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userProfile: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  userIsInitialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.initializeUserProfile();
  }

  updateIsLoggedIn(): void {
    this.http.get<boolean>(serverUrl + 'accounts/is_authenticated', {withCredentials: true})
      .subscribe((value: boolean): void => {
        this.isLoggedIn.next(value);
      })
  }

  initializeUserProfile(): void {
    this.getUpdateUserProfileObservable()
      .subscribe(user => {
        this.userProfile.next(user);
        this.userIsInitialized.next(true);
      })
  }

  updateUserProfile(): void {
    this.getUpdateUserProfileObservable()
      .subscribe((value: User | null): void => {
        this.userProfile.next(value);
      })
  }

  getUpdateUserProfileObservable(): Observable<User | null> {
    return this.http.get<User | null>(serverUrl + 'accounts/profile', {withCredentials: true});
  }

  logout(): void {
    this.http.post(serverUrl + 'accounts/logout', null, {withCredentials: true})
      .subscribe(value => {});
  }

  login({username, password}: {username: string, password: string}): Observable<User> {
    return this.http.post<User>(
      serverUrl + 'accounts/login',
      JSON.stringify({username: username, password: password}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        tap(
          user => {this.userProfile.next(user)}
        )
      );
  }

  signup(
    {username, password, firstName, lastName}:
      {username: string, password: string, firstName: string, lastName: string}
  ): Observable<User> {
    return this.http.post<User>(
      serverUrl + 'accounts/signup',
      JSON.stringify({username: username, password: password, firstName: firstName, lastName: lastName}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(
        user => {this.userProfile.next(user)}
      )
    );
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

  changeEmail(email: string): void {
    this.http.post(
      serverUrl + 'accounts/change_email',
      JSON.stringify({
        email: email,
        siteName: 'socialNetwork',
        confirmEmailUrl: 'http://localhost:4200/accounts/confirm_change_email'
      }),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  confirmChangeEmail(token: string): void {
    this.http.post<User>(
      serverUrl + 'accounts/change_email_confirm',
      JSON.stringify({
        token: token
      }),
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
    this.http.patch<User>(
      serverUrl + 'accounts/profile',
      formData,
      {
        withCredentials: true
      }).subscribe(user => {this.userProfile.next(user)})
  }

  changePassword(data: {oldPassword: string, newPassword: string}): void {
    this.http.post<User>(
      serverUrl + 'accounts/change_password',
      JSON.stringify(data),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  resetPassword(email: string): void {
    this.http.post(
      serverUrl + 'accounts/password_reset',
      JSON.stringify({
        email: email,
        confirmResetPasswordUrl: 'http://localhost:4200/accounts/reset_password_confirm'
      }),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  confirmResetPassword(token: string, password: string, uid: string): void {
    this.http.post(
      serverUrl + 'accounts/password_reset_confirm',
      JSON.stringify({token: token, password: password, uid: uid}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  isSubscribedTo(to: number): Observable<boolean> {
    return this.http.post<boolean>(
      serverUrl + 'accounts/is_subscribed',
      JSON.stringify({to: to}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )
  }

  subscribe(to: number): void {
    this.http.post(
      serverUrl + 'accounts/subscribe',
      JSON.stringify({to: to}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  unsubscribe(from: number): void {
    this.http.post(
      serverUrl + 'accounts/unsubscribe',
      JSON.stringify({from: from}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).subscribe(value => {})
  }

  getUserById(id: number): Observable<User | null> {
    const cache = usersCache.find(u => u.pk === id);
    if (cache)
      return of(cache);
    return this.http.get<User | null>(
      serverUrl + 'accounts/user/' + id
    )
      .pipe(
        tap((user: User | null): void => {if (user) usersCache.push(user)})
      );
  }
}
