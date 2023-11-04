import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post, PostRateEnum } from "../../../../models/post";
import { PostService } from "../../../../services/post.service";
import { serverUrl } from "../../../../constants";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  @Output() outPostIdViewed: EventEmitter<number> = new EventEmitter<number>;
  protected readonly PostRateEnum = PostRateEnum;
  postRate: PostRateEnum = PostRateEnum.none;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postRate = this.post.current_user_rate;
  }

  getSrcForAddingPostToViewed(): string {
    return serverUrl + `feed/add_post_to_viewed/${this.post.pk}`
  }

  postViewed(): void {
    this.outPostIdViewed.emit(this.post.pk);
  }
}
