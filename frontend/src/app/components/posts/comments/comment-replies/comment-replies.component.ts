import { Component, Input, OnInit } from '@angular/core';
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
  totalRepliesAmount: number = 0;
  repliesAmountToShow: number = 0;
  repliesIncrement = 2;
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
    console.log("show more replies");
    if (this.repliesAmountToShow + this.repliesIncrement >= this.totalRepliesAmount)
      this.repliesAmountToShow = this.totalRepliesAmount;
    else
      this.repliesAmountToShow += this.repliesIncrement;
    this.loadAdditionalReplies(this.repliesIncrement);
  }

  loadAdditionalReplies(amount: number): void {
    console.log("load additional replies");
    this.postService.getCommentsReplies(this.comment.pk, this.replies.length, amount)
      .subscribe((replies: CommentReply[]): void => {
        this.replies.push(...replies);
      });
  };

  toggleReplies(): void {
    console.log("toggle");
    if (this.repliesAmountToShow === 0) {
      this.showMoreReplies();
    }
    this.showReplies = !this.showReplies;
  }
}
