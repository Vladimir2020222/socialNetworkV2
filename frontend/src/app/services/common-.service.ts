import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { serverUrl } from "../constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) {}

  setTimezone(timezone: String): Observable<String> {
    return this.http.post<String >(
      serverUrl + 'set_timezone',
      JSON.stringify({'timezone': timezone}),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      }
    );
  }
}
