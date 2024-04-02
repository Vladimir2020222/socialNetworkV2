import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeedService } from "../../../services/feed.service";
import { Post } from "../../../models/post";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @Input() posts: Post[] | null = null;
  @Output() outPostIdViewed: EventEmitter<number> = new EventEmitter<number>();
  postsAreFromInput: boolean = false;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    if (!this.posts) {
      this.loadAdditionalPosts();
    } else {
      this.postsAreFromInput = true;
    }
  }

  loadAdditionalPosts(): void {
    this.feedService.getAdditionalPosts()
      .subscribe(posts => {
        if (!this.posts) {
          this.posts = [];
        }
        this.posts.push(...posts)
      })
  }

  postViewed(postPk: number): void {
    if (!this.postsAreFromInput) {
      if (this.posts && postPk === this.posts[this.posts.length - 1].pk) {
        this.loadAdditionalPosts();
      }
    }
    this.outPostIdViewed.emit(postPk);
  }
}
