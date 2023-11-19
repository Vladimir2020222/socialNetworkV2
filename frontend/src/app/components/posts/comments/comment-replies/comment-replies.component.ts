import { Component, Input } from '@angular/core';
import { CommentReply } from "../../../../models/comment-reply";
import { PostService } from "../../../../services/post.service";
import { Comment } from "../../../../models/comment"

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent {
  @Input() comment!: Comment;
  replies: CommentReply[] = [];
  repliesAmountPerRequest = 5;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadAdditionalReplies();
  }

  loadAdditionalReplies = (): void => {
    this.postService.getCommentsReplies(this.comment.pk, this.replies.length, this.repliesAmountPerRequest)
      .subscribe(replies => {
        this.replies.push(...replies);
      });
  };
}
