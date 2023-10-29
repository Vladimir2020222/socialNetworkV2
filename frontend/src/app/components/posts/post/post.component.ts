import { Component, Input, OnInit } from '@angular/core';
import { Post, PostRateEnum } from "../../../models/post";
import { PostService } from "../../../services/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  postRate: PostRateEnum = PostRateEnum.none;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.setPostRate();
  }

  setPostRate(): void {
    this.postService.getPostRate(this.post.pk)
      .subscribe(
        (value: PostRateEnum): void => {
          this.postRate = value
        }
      )
  }

  addPostToViewed(): void {
    this.postService.addPostToViewed(this.post.pk);
  }

  protected readonly PostRateEnum = PostRateEnum;
}
