import { Component, Input } from '@angular/core';
import { Comment} from "../../../../models/comment";
import { PostService } from "../../../../services/post.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
    @Input() comment!: Comment;
    showReplies: boolean = false;

    constructor(private postService: PostService) {}

    toggleReplies(): void {
      this.showReplies = !this.showReplies;
    }
}
