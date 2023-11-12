import { Component, Input } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent {
  @Input() reply!: CommentReply;
}
