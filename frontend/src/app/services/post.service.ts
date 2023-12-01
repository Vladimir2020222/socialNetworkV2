import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Post } from "../models/post";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { serverUrl } from "../constants";
import { CommentReply } from "../models/comment-reply";
import { Comment } from "../models/comment";

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
      {
        withCredentials: true
      }
    );
  }

  getCommentsReplies(commentPk: number, offset: number, amount: number): Observable<CommentReply[]> {
    return this.http.get<CommentReply[]>(
      serverUrl + `feed/comment_replies/${commentPk}?offset=${offset}&amount=${amount}`,
      {
        withCredentials: true
      }
    )
  }

  getPostComments(postPk: number, offset: number, amount: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      serverUrl + `feed/post/${postPk}/comments?offset=${offset}&amount=${amount}`,
      {
        withCredentials: true
      }
    );
  }

  getRepliesAmount(commentPk: number): Observable<number> {
    return this.http.get<number>(
      serverUrl + `feed/comment_replies/${commentPk}/amount`
    )
  }

  getCommentsAmount(postPk: number): Observable<number> {
    return this.http.get<number>(
      serverUrl + `feed/post/${postPk}/comments/amount`
    );
  }

  like(pk: number, objectName: string): void {
    this._rate(pk, objectName, 'like');
  }

  dislike(pk: number, objectName: string): void {
    this._rate(pk, objectName, 'dislike');
  }

  removeLike(pk: number, objectName: string): void {
    this._rate(pk, objectName, 'remove_like');
  }

  removeDislike(pk: number, objectName: string): void {
    this._rate(pk, objectName, 'remove_dislike')
  }

  private _rate(pk: number, objectName: string, action: string): void {
    this.http.post(
      serverUrl + `feed/${action}/${objectName}/${pk}`,
      null,
      {
        withCredentials: true
      }
    ).subscribe();
  }

  createComment(postPk: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(
      serverUrl + 'feed/comment',
      JSON.stringify({
        text: text,
        post: postPk
      }),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      }
    );
  }

  createReply(commentPk: number, text: string, replyTo: number[]): Observable<CommentReply> {
    return this.http.post<CommentReply>(
      serverUrl + 'feed/reply',
      JSON.stringify({
        text: text,
        to: commentPk,
        reply_to: replyTo
      }),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      }
    );
  }
}
