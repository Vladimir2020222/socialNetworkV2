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

  getPostLikedBy(pk: number): Observable<number[]> {
    return this.http.get<number[]>(
      serverUrl + 'feed/users_liked_post_list'
    )
  }

  getPostDislikedBy(pk: number): Observable<number[]> {
    return this.http.get<number[]>(
      serverUrl + 'feed/users_disliked_post_list'
    )
  }
}
