import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { PostService } from "../../../../services/post.service";
import { Comment } from "../../../../models/comment"

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnInit {
  @Input() comment!: Comment;
  replies: CommentReply[] = [];
  @Output() showedRepliesAmount: EventEmitter<number> = new EventEmitter<number>();
  totalRepliesAmount: number = 0;
  repliesIncrement = 5;
  showReplies: boolean = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.setTotalRepliesAmount();
  }

  setTotalRepliesAmount(): void {
    this.postService.getRepliesAmount(this.comment.pk)
      .subscribe((totalRepliesAmount: number): void => {
        this.totalRepliesAmount = totalRepliesAmount;
      })
  }

  showMoreReplies(): void {
    let amount: number = this.repliesIncrement;
    if (this.totalRepliesAmount - this.replies.length - this.repliesIncrement <= 0)
      amount = this.totalRepliesAmount - this.replies.length;
    this.loadAdditionalReplies(amount);
  }

  loadAdditionalReplies(amount: number): void {
    this.postService.getCommentsReplies(this.comment.pk, this.replies.length, amount)
      .subscribe((replies: CommentReply[]): void => {
        this.replies.push(...replies);
        if (this.showReplies)
          this.showedRepliesAmount.emit(this.replies.length)
      });
  };

  toggleReplies(): void {
    if (this.replies.length === 0) {
      this.showMoreReplies();
    }
    this.showReplies = !this.showReplies;
    if (this.showReplies)
      this.showedRepliesAmount.emit(this.replies.length);
    else
      this.showedRepliesAmount.emit(0);
  }
}
