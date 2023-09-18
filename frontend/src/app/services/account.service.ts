import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private serverUrl = 'http://127.0.0.1:8000/';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  updateIsLoggedIn() {
    this.http.get(this.serverUrl + 'accounts/is_authenticated')
      .subscribe(value => {
        console.log(value)})
  }
}
