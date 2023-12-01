import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Comment } from "../../../../../models/comment";
import { PostService } from "../../../../../services/post.service";
import { CommentReply } from "../../../../../models/comment-reply";
import { User } from "../../../../../models/user";
import { getUserFromCache } from "../../../../../utils";

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['../styles.css']
})
export class ReplyFormComponent implements OnChanges {
  @Input() reply!: Comment;
  @Output() newReply: EventEmitter<CommentReply> = new EventEmitter<CommentReply>();
  @Input() replyTo: number[] = [];
  @Input() clickedReplyPk!: number | null;

  constructor(private postService: PostService) {}

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
    const author: User | undefined = getUserFromCache(this.reply.author);
    if (!author)
      return '';
    return `reply to ${author.first_name} ${author.last_name}`
  }

  submitCallback(obj: CommentReply): void {
    this.newReply.emit(obj);
  }

  submit(text: string): void {
      this.postService.createReply(this.reply.pk, text, this.replyTo).subscribe(this.submitCallback);
  }
}
