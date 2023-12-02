import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { PostService } from "../../../../../services/post.service";
import { Post } from "../../../../../models/post";
import { Common } from "../common";

@Component({
  selector: 'app-comment-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class CommentFormComponent extends Common {
  readonly document = document;
  readonly placeholder: string = "leave a comment";
  @Input() post!: Post;
  @Output() newPost: EventEmitter<Comment> = new EventEmitter<Comment>();

  constructor(private postService: PostService) {
    super();
  }

  getIdForMainInputElement(): string {
    return `main-input-post-${this.post.pk}`;
  }

  submitCallback(obj: Comment): void {
    this.newPost.emit(obj);
  }

  submit(): void {
    this.postService.createComment(this.post.pk, this.text).subscribe(this.submitCallback);
  }
}
