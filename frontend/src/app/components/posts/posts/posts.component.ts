import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService } from "../../../services/post.service";
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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    setTimeout(() => console.log(this.posts), 1000)
    if (!this.posts) {
      this.loadAdditionalPosts();
    } else {
      this.postsAreFromInput = true;
    }
  }

  loadAdditionalPosts(): void {
    this.postService.getAdditionalPosts()
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
