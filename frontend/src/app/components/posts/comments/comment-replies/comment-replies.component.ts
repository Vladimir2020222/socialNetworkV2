import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { PostService } from "../../../../services/post.service";
import { Comment } from "../../../../models/comment"

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnChanges {
  @Input() comment!: Comment;
  @Input() repliesAmount: number = 0;
  replies: CommentReply[] = [];

  constructor(private postService: PostService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['repliesAmount']) {
      console.log(this.repliesAmount - this.replies.length, " LOADED");
      this.loadAdditionalReplies(this.repliesAmount - this.replies.length);
    }
  }

  loadAdditionalReplies(amount: number): void {
    this.postService.getCommentsReplies(this.comment.pk, this.replies.length, amount)
      .subscribe((replies: CommentReply[]): void => {
        this.replies.push(...replies);
      });
  };
}
