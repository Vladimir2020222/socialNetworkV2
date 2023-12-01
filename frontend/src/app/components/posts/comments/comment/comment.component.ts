import { Component, Input, OnInit } from '@angular/core';
import { Comment} from "../../../../models/comment";
import { PostService } from "../../../../services/post.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  showReplyForm: boolean = false;

  showedRepliesAmountChanged(value: number): void {
    this.showReplyForm = value != 0;
  }
}
