import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { Post } from "../../../models/post";
import { PostService } from "../../../services/post.service";

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css']
})
export class ProfilePostsComponent implements OnInit {
  @Input() user!: User;
  posts: Post[] = [];
  readonly postsAmountPerRequest: number = 3;
  offset: number = 0;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.loadAdditionalPosts();
  }

  loadAdditionalPosts(): void {
    this.postService.getPostsByUser(this.user.pk, this.offset, this.postsAmountPerRequest)
      .subscribe((posts: Post[]): void => {
        this.posts.push(...posts);
      });
    this.offset += this.postsAmountPerRequest;
  }

  postViewed(postPk: number): void {
    if (postPk === this.posts[this.posts.length - 1].pk) {
      this.loadAdditionalPosts();
    }
  }
}
