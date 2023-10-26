import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Post } from "../models/post";
import { HttpClient } from "@angular/common/http";
import { serverUrl } from "../constants";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  getAdditionalPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(
      serverUrl + 'feed/get_additional_posts',
      {
        withCredentials: true
      }
    )
  }
}
