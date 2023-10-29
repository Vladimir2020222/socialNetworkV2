import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Post, PostRateEnum } from "../models/post";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  addPostToViewed(pk: number): void {
    this.http.post(
      serverUrl + 'feed/add_post_to_viewed',
      JSON.stringify({pk: pk}),
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  getPostRate(pk: number): Observable<PostRateEnum> {
    return this.http.get<PostRateEnum>(
      serverUrl + `feed/get_post_rate/${pk}`,
      {
        withCredentials: true
      }
    );
  }
}
