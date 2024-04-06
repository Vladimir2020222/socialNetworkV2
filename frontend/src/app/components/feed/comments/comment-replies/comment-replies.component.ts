import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { FeedService } from "../../../../services/feed.service";
import { Comment } from "../../../../models/comment"

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnInit, OnChanges {
  @Input() comment!: Comment;
  replies: CommentReply[] = [];
  @Input() newReplies: CommentReply[] = [];
  @Output() showedRepliesAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output() clickedReplyPk: EventEmitter<number> = new EventEmitter<number>();
  totalRepliesAmount: number = 0;
  repliesIncrement: number = 5;
  showReplies: boolean = false;
  lastClickedReplyData: {authorName: string, pk: number} | null = null;

  constructor(private feedService: FeedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newReplies']) {
      this.showReplies = true;
    }
  }

  ngOnInit(): void {
    this.setTotalRepliesAmount();
  }

  clickedReply(data: {authorName: string, pk: number}): void {
    this.clickedReplyPk.emit(data.pk);
    this.lastClickedReplyData = data;
  }

  setTotalRepliesAmount(): void {
    this.feedService.getRepliesAmount(this.comment.pk)
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
    this.feedService.getCommentsReplies(this.comment.pk, this.replies.length, amount)
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
