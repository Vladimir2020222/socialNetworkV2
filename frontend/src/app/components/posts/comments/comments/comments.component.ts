import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../models/post";
import { PostService } from "../../../../services/post.service";
import { Comment } from "../../../../models/comment";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() post!: Post;
  comments: Comment[] = [];
  commentsAmountPerRequest: number = 5;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadAdditionalComments();
  }

  loadAdditionalComments(): void {
    this.postService.getPostComments(this.post.pk, this.comments.length, this.commentsAmountPerRequest)
      .subscribe((comments: Comment[]): void => {
        this.comments.push(...comments);
      });
  }
}
