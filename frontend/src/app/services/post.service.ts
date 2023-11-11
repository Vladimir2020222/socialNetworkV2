import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Post } from "../models/post";
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

  createPost(files: FileList | null, text: string): Observable<Post> {
    return new Observable<Post>(observer => {
      let post: Post | undefined; // post object returned by server

      this.http.post<Post>(
        serverUrl + 'feed/post',
        {
          text: text
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          withCredentials: true
        }
      )  // creating post
        .subscribe((value: Post): void => {
          if (!files) {
            return
          }
          post = value; // assigning value returned by server to variable

          const formDataImages: FormData = new FormData();
          for (const file of Array.from(files)) { // adding files passed to createPost method to FormData object
            formDataImages.append('images', file, file.name);
          }

          const images$ = this.http.post<{images: string[]}>(
            serverUrl + 'feed/add_images_to_post/' + String(value.pk),
            formDataImages,
            {
              withCredentials: true
            }
          ) // adding images to the post
            .subscribe(images => {
              if (post) { // this is necessary because post type is Post|undefined
                post.images = images["images"];
                observer.next(post);
              }
            })
        });
    });
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

  getPostsByUser(userPk: number, offset: number, amount: number): Observable<Post[]> {
    return this.http.get<Post[]>(
      serverUrl + `feed/posts/by/${userPk}?offset=${offset}&amount=${amount}`,
    );
  }
}
