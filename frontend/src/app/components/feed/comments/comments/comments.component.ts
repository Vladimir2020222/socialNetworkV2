import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../models/post";
import { FeedService } from "../../../../services/feed.service";
import { Comment } from "../../../../models/comment";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() post!: Post;
  @Input() newComments: Comment[] = [];
  comments: Comment[] = [];
  commentsAmountPerRequest: number = 5;
  totalCommentsAmount: number = 0;
  showLoadMoreCommentsButton: boolean = false;

  constructor(private FeedService: FeedService) {}

  ngOnInit(): void {
    this.setTotalCommentsAmount();
  }

  setTotalCommentsAmount(): void {
    this.FeedService.getCommentsAmount(this.post.pk)
      .subscribe((totalCommentsAmount: number): void => {
        this.totalCommentsAmount = totalCommentsAmount;
        if (this.totalCommentsAmount != 0)
          this.showLoadMoreCommentsButton = true;
        this.loadAdditionalComments(this.commentsAmountPerRequest);
      });
  }

  showMoreComments(): void {
    let amount: number = this.commentsAmountPerRequest;
    if (this.totalCommentsAmount - this.comments.length - this.commentsAmountPerRequest <= 0) {
      amount = this.totalCommentsAmount - this.comments.length;
      this.showLoadMoreCommentsButton = false;
    }
    this.loadAdditionalComments(amount);
  }

  loadAdditionalComments(amount: number): void {
    this.FeedService.getPostComments(this.post.pk, this.comments.length, amount)
      .subscribe((comments: Comment[]): void => {
        this.comments.push(...comments);
      });
  }
}
