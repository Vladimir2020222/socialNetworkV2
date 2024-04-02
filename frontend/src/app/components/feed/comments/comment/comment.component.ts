import { Component, Input } from '@angular/core';
import { Comment} from "../../../../models/comment";
import {CommentReply} from "../../../../models/comment-reply";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  newReplies: CommentReply[] = [];
  showReplyForm: boolean = false;
  clickedReplyPk: number | null = null;

  showedRepliesAmountChanged(value: number): void {
    this.showReplyForm = value != 0;
  }
}
