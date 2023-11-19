import { Component, Input, OnInit } from '@angular/core';
import { PostService } from "../../../services/post.service";
import { Post } from "../../../models/post";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @Input() posts: Post[] | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    if (!this.posts) {
      this.loadAdditionalPosts();
    }
  }

  loadAdditionalPosts(): void {
    this.postService.getAdditionalPosts()
      .subscribe(posts => {
        if (this.posts) {
          this.posts.push(...posts)
        }
      })
  }

  postViewed(postPk: number): void {
    if (this.posts && postPk === this.posts[this.posts.length - 1].pk) {
      this.loadAdditionalPosts();
    }
  }
}
