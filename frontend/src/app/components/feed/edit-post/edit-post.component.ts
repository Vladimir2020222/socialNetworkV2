import {Component, Input, OnInit} from '@angular/core';
import { Post } from "../../../models/post";
import { FeedService } from "../../../services/feed.service";
import {ActivatedRoute} from "@angular/router";
import { serverUrl } from "../../../constants";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  protected readonly serverUrl = serverUrl;
  post: Post | null = null;
  initialText: string | undefined = undefined;
  imagesToRemove: Post['images'] = [];

  constructor(private feedService: FeedService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let pk: number = Number(this.route.snapshot.paramMap.get('postPk'));
    if (pk == 0) return;
    this.feedService.getPostByPk(pk)
      .subscribe((post: Post): void => {
        this.post = post;
        this.initialText = post.text;
      });
  }

  deleteImageButtonClicked(image: Post['images'][0]): void {
    this.imagesToRemove.push(image);
    if (!this.post) return;
    this.post.images.splice(this.post.images.indexOf(image), 1);
  }

  submit(files: FileList | null): void {
    if (!this.post) return;
    if (this.post.text !== this.initialText) {
      this.feedService.updatePost(this.post.pk, this.post.text).subscribe(_ => {});
    }
    if (this.imagesToRemove.length !== 0) {
      this.feedService.deleteImagesFromPost(
        this.post.pk, this.imagesToRemove.map(e => e.pk)
      )
        .subscribe((success: boolean): void => {

        });
    }
    if (files && files.length !== 0) {
      this.feedService.addImagesToPost(this.post.pk, files)
        .subscribe((images: Post['images']): void => {
          if (!this.post) return;
          this.post.images.push(...images);
        });
    }
  }
}
