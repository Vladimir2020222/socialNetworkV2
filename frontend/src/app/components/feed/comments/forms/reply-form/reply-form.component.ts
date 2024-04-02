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

@Component({
  selector: 'app-reply-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class ReplyFormComponent implements OnChanges {
  @Input() comment!: Comment;
  @Output() newReply: EventEmitter<CommentReply> = new EventEmitter<CommentReply>();
  @Input() replyTo: number[] = [];
  @Input() clickedReplyPk!: number | null;

  constructor(private feedService: FeedService) {  }

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

  get placeholder(): string {
    const author: User | undefined = getUserFromCache(this.comment.author);
    if (!author)
      return '';
    return `reply to ${author.firstName} ${author.lastName}`
  }

  submit(text: string): void {
      this.feedService.createReply(this.comment.pk, text, this.replyTo).subscribe(
        (reply: CommentReply): void => {
          this.newReply.emit(reply);
        }
      );
  }
}
