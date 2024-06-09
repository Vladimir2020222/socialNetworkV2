import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { FeedService } from "../../../../services/feed.service";
import { Comment } from "../../../../models/comment"
import {Observable} from "rxjs";

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnInit, OnChanges {
  @Input() comment!: Comment;
  @Input() openReplyPk: number | null = null;
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
    if (changes['newReplies'] && !changes['newReplies'].isFirstChange()) {
      this.showReplies = true;
    }
  }

  ngOnInit(): void {
    this.setTotalRepliesAmount().subscribe(value => this.openReply());
  }

  openReply(): void {
    if (this.openReplyPk) {
      this.showReplies = true;
      const loadMore = (): void => {
        this.loadAdditionalReplies(1)
          .subscribe((loaded: boolean): void => {
            if ((!loaded) || this.openReplyPk === null) return;  // to satisfy typescript
            if (this.replies.map(x => x.pk).includes(this.openReplyPk)) {
              this.scrollToReply(this.openReplyPk);
            }
            loadMore();
          })
      }
      loadMore();
    }
  }

  scrollToReply(replyPk: number): void {
    let interval: number;
    const retryDelay = 150;
    const retryAttempts = 20;
    const tryScrolling = (): void => {
      const element = document.getElementById(`reply-${this.openReplyPk}`);
      if (element === null) return;
      element.scrollIntoView();
      clearInterval(interval);
    }
    interval = setInterval(tryScrolling, retryDelay);
    setTimeout(() => clearInterval(interval), retryDelay * retryAttempts);
  }

  clickedReply(data: {authorName: string, pk: number}): void {
    this.clickedReplyPk.emit(data.pk);
    this.lastClickedReplyData = data;
  }

  setTotalRepliesAmount(): Observable<any> {
    return new Observable(observer => {
      this.feedService.getRepliesAmount(this.comment.pk)
        .subscribe((totalRepliesAmount: number): void => {
          this.totalRepliesAmount = totalRepliesAmount;
          observer.next(1);
        })
    })
  }

  showMoreReplies(amount?: number): void {
    this.loadAdditionalReplies(amount).subscribe(x => {});
  }

  loadAdditionalReplies(amount?: number): Observable<boolean> {
    return new Observable(observer => {
      amount = amount || this.repliesIncrement;
      if (this.totalRepliesAmount - this.replies.length <= 0) {
        observer.next(false);
        return
      }
      amount = this.totalRepliesAmount - this.replies.length;
      this.feedService.getCommentsReplies(this.comment.pk, this.replies.length, amount)
        .subscribe((replies: CommentReply[]): void => {
          this.replies.push(...replies);
          observer.next(true);
          if (this.showReplies)
            this.showedRepliesAmount.emit(this.replies.length);
        });
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
