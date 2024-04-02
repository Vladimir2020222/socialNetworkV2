import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { FeedService } from "../../../../../services/feed.service";
import { CommentReply } from "../../../../../models/comment-reply";
import { User } from "../../../../../models/user";
import { getUserFromCache } from "../../../../../utils";
import { Common } from "../common";

@Component({
  selector: 'app-reply-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class ReplyFormComponent extends Common implements OnChanges {
  readonly document = document;
  @Input() comment!: Comment;
  @Output() newReply: EventEmitter<CommentReply> = new EventEmitter<CommentReply>();
  @Input() replyTo: number[] = [];
  @Input() clickedReplyPk!: number | null;

  constructor(private feedService: FeedService) {
    super();
  }

  getIdForMainInputElement(): string {
    return `main-input-comment-${this.comment.pk}`;
  }

  get placeholder(): string {
    return this.getPlaceholderForInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const clickedReplyPkChange: SimpleChange = changes['clickedReplyPk'];
    if (
      clickedReplyPkChange &&
      clickedReplyPkChange.currentValue !== null &&
      clickedReplyPkChange.previousValue !== clickedReplyPkChange.currentValue
    ) {
        this.replyTo.push(clickedReplyPkChange.currentValue);
    }
  }

  getPlaceholderForInput(): string {
    const author: User | undefined = getUserFromCache(this.comment.author);
    if (!author)
      return '';
    return `reply to ${author.firstName} ${author.lastName}`
  }

  submitCallback(obj: CommentReply): void {
    this.newReply.emit(obj);
    this.clear();
  }

  submit(): void {
      this.feedService.createReply(this.comment.pk, this.text, this.replyTo).subscribe(this.submitCallback.bind(this));
  }
}
