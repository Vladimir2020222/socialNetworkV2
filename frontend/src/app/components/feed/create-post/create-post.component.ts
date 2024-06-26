import { Component, OnInit } from '@angular/core';
import { FeedService } from "../../../services/feed.service";
import { Post } from "../../../models/post";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css', '../../forms.css']
})
export class CreatePostComponent implements OnInit {
  post: Post | undefined;
  constructor(private feedService: FeedService, private router: Router) {}

  ngOnInit(): void {
  }

  submit(images: FileList | null, text: string): void {
    this.feedService.createPost(images, text)
      .subscribe(post => {
        this.post = post;
        this.router.navigate(['/post/', post.pk]);
      });
  }
}
