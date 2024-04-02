import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { FeedService } from "../../../../../services/feed.service";
import { Post } from "../../../../../models/post";

@Component({
  selector: 'app-comment-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class CommentFormComponent {
  @Input() post!: Post;
  @Output() newComment: EventEmitter<Comment> = new EventEmitter<Comment>();

  constructor(private feedService: FeedService) {  }

  get placeholder(): string {
    return 'leave a comment';
  }

  submit(text: string): void {
    this.feedService.createComment(this.post.pk, text).subscribe(
      (comment: Comment): void => {
        this.newComment.emit(comment);
      }
    );
  }
}
