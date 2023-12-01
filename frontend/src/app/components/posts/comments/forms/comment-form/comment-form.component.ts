import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { PostService } from "../../../../../services/post.service";
import { Post } from "../../../../../models/post";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['../styles.css']
})
export class CommentFormComponent {
  @Input() post!: Post;
  @Output() newPost: EventEmitter<Comment> = new EventEmitter<Comment>();

  constructor(private postService: PostService) {}

  submitCallback(obj: Comment): void {
    this.newPost.emit(obj);
  }

  submit(text: string): void {
    this.postService.createComment(this.post.pk, text).subscribe(this.submitCallback);
  }
}
