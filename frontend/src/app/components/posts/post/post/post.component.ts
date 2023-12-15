import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from "../../../../models/post";
import { Comment } from "../../../../models/comment";
import { PostService } from "../../../../services/post.service";
import { serverUrl } from "../../../../constants";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() post!: Post;
  newComments: Comment[] = [];
  showComments: boolean = false;
  @Output() outPostIdViewed: EventEmitter<number> = new EventEmitter<number>;

  constructor(private postService: PostService) {}

  getSrcForAddingPostToViewed(): string {
    return serverUrl + `feed/add_post_to_viewed/${this.post.pk}`
  }

  postViewed(): void {
    this.outPostIdViewed.emit(this.post.pk);
  }
}
