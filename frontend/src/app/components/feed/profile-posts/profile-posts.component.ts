import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { Post } from "../../../models/post";
import { FeedService } from "../../../services/feed.service";

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

  constructor(private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.loadAdditionalPosts();
  }

  loadAdditionalPosts(): void {
    this.feedService.getPostsByUser(this.user.pk, this.offset, this.postsAmountPerRequest)
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
