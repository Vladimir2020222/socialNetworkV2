import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../models/post";
import { FeedService } from "../../../../services/feed.service";
import { Comment } from "../../../../models/comment";
import {CommentReply} from "../../../../models/comment-reply";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() post!: Post;
  @Input() openCommentPk: number | null = null;
  @Input() openReplyPk: number | null = null;
  @Input() newComments: Comment[] = [];
  comments: Comment[] = [];
  commentsAmountPerRequest: number = 5;
  totalCommentsAmount: number = 0;
  showLoadMoreCommentsButton: boolean = false;
  passOpenReplyPkCommentPk: number | undefined;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.setTotalCommentsAmount();
    if (this.openCommentPk) {
      this.openComment(this.openCommentPk)
    } else if (this.openReplyPk) {
      this.feedService.getReplyByPk(this.openReplyPk)
        .subscribe((reply: CommentReply): void => {
          this.openComment(reply.to);
        })
    }
  }

  openComment(commentPk: number): void {
    this.feedService.getCommentByPk(commentPk)
      .subscribe((comment: Comment): void => {
        this.comments.unshift(comment);
        this.passOpenReplyPkCommentPk = comment.pk;
      })
  }

  setTotalCommentsAmount(): void {
    this.feedService.getCommentsAmount(this.post.pk)
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
    this.feedService.getPostComments(this.post.pk, this.comments.length, amount)
      .subscribe((comments: Comment[]): void => {
        if (this.openCommentPk) {
          comments = comments.filter(value => value.pk != this.openCommentPk);
        }
        this.comments.push(...comments);
      });
  }
}
