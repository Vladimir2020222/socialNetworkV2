import { Component, Input } from '@angular/core';
import { serverUrl } from "../../../../constants";
import {Post} from "../../../../models/post";

@Component({
  selector: 'app-post-images',
  templateUrl: './post-images.component.html',
  styleUrls: ['./post-images.component.css']
})
export class PostImagesComponent {
  @Input() images!: Post['images'];
  activeImage: number = 0;
  serverUrl = serverUrl;
}
