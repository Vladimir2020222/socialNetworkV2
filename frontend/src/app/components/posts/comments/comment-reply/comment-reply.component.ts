import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnInit {
  @Input() reply!: CommentReply;
  @Input() allReplies!: CommentReply[];
  @Output() clickedReplyPk: EventEmitter<number> = new EventEmitter<number>();
  replyToNames: string[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setReplyToNames();
  }

  onclick(): void {
    this.clickedReplyPk.emit(this.reply.pk);
  }

  setReplyToNames(): void {
    const filtered: CommentReply[] = this.allReplies.filter(
      (reply: CommentReply): boolean => this.reply.reply_to.includes(reply.pk)
    );
    const names: string[] = [];
    filtered.forEach((reply: CommentReply): void => {
      this.accountService.getUserById(reply.author)
        .subscribe((author: User | null): void => {
          if (!author) return;
          names.push(`${author.first_name} ${author.last_name}`);
        });
    });
    this.replyToNames = names;
  }
}
