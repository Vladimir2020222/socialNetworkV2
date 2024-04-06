import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css', '../common.css']
})
export class CommentReplyComponent implements OnInit, OnChanges {
  @Input() reply!: CommentReply;
  @Input() allReplies!: CommentReply[];
  @Input() clickedReplyDataInput: {authorName: string, pk: number} | null = null;
  @Output() clickedReplyDataOutput: EventEmitter<{authorName: string, pk: number}> = new EventEmitter();
  replyTo: {authorName: string, pk: number}[] = [];
  replyToEditForm: {authorName: string, pk: number}[] = [];
  showEditReplyCommentForm: boolean = false;
  currentUserIsAuthor: boolean = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setReplyToNames();
    this.accountService.userProfile
      .subscribe(
        (user: User | null): void => {
          this.currentUserIsAuthor = user?.pk === this.reply.author;
        }
      )
  }

  ngOnChanges(changes: SimpleChanges): void {
    const clickedReplyPkChange: SimpleChange = changes['clickedReplyDataInput'];
    if (
      clickedReplyPkChange &&
      clickedReplyPkChange.currentValue !== null &&
      clickedReplyPkChange.previousValue !== clickedReplyPkChange.currentValue
    ) {
      let pk = clickedReplyPkChange.currentValue.pk;
      if (pk !== this.reply.pk && !this.replyToEditForm.concat(this.replyTo).map(e => e.pk).includes(pk)) {
        this.replyToEditForm.push(clickedReplyPkChange.currentValue);
      }
    }
  }

  onclick(): void {
    this.accountService.getUserById(this.reply.author)
      .subscribe(
        (user: User | null): void => {
          if (user === null) return;
          this.clickedReplyDataOutput.emit({authorName: `${user.firstName} ${user.lastName}`, pk: this.reply.pk});
        }
    )
  }

  setReplyToNames(): void {
    const filtered: CommentReply[] = this.allReplies.filter(
      (reply: CommentReply): boolean => this.reply.replyTo.includes(reply.pk)
    );
    filtered.forEach((reply: CommentReply): void => {
      this.accountService.getUserById(reply.author)
        .subscribe((author: User | null): void => {
          if (!author) return;
          this.replyTo.push({authorName: `${author.firstName} ${author.lastName}`, pk: author.pk});
        });
    });
  }
}
