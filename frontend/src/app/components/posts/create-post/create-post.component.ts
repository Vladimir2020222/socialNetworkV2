import { Component, OnInit } from '@angular/core';
import { PostService } from "../../../services/post.service";
import { Post } from "../../../models/post";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css', '../../forms.css']
})
export class CreatePostComponent implements OnInit {
  post: Post | undefined;
  constructor(private postService: PostService) {}

  ngOnInit(): void {
  }

  submit(images: FileList | null, text: string): void {
    this.postService.createPost(images, text)
      .subscribe(post => {
        this.post = post;
      });
  }
}
