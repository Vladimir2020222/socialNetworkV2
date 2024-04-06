import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import { CommentReply } from "../../../../../models/comment-reply";
import {FeedService} from "../../../../../services/feed.service";

@Component({
  selector: 'app-edit-reply-comment-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class EditReplyCommentFormComponent {
  @Input() reply!: CommentReply;
  @Input() replyTo: {authorName: string, pk: number}[] = [];
  @Output() submitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private feedService: FeedService) {  }

  get placeholder(): string {
    return 'edit a reply'
  }

  submit(text: string): void {
    this.submitted.emit(true);
    this.feedService.updateReply(this.reply.pk, text, this.replyTo.map(e => e.pk))
      .subscribe(
        (reply: CommentReply): void => {
          this.reply.replyTo = reply.replyTo;
          this.reply.text = reply.text;
          this.reply.updDate = reply.updDate;
        }
      );
  }
}
