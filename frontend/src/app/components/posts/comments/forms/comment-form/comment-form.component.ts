import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { PostService } from "../../../../../services/post.service";
import { Post } from "../../../../../models/post";

@Component({
  selector: 'app-comment-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class CommentFormComponent {
  readonly document = document;
  readonly placeholder: string = "leave a comment";
  @Input() post!: Post;
  @Output() newPost: EventEmitter<Comment> = new EventEmitter<Comment>();
  text: string = '';

  constructor(private postService: PostService) {}

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
