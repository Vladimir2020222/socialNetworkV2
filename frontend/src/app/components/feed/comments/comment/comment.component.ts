import {Component, Input, OnInit} from '@angular/core';
import { Comment} from "../../../../models/comment";
import {CommentReply} from "../../../../models/comment-reply";
import {AccountService} from "../../../../services/account.service";
import {User} from "../../../../models/user";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css', '../common.css']
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  newReplies: CommentReply[] = [];
  showReplyForm: boolean = false;
  showEditCommentForm: boolean = false;
  currentUserIsAuthor: boolean = false;
  clickedReplyPk: number | null = null;

  showedRepliesAmountChanged(value: number): void {
    this.showReplyForm = value != 0;
  }

  constructor(private accountService: AccountService) {  }

  ngOnInit(): void {
    this.accountService.userProfile.subscribe(
      (user: User | null): void => {
        this.currentUserIsAuthor = user?.pk === this.comment.author;
      }
    );
  }
}
