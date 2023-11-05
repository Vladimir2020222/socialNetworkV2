import { Component, Input } from '@angular/core';
import { serverUrl } from "../../../../constants";

@Component({
  selector: 'app-post-images',
  templateUrl: './post-images.component.html',
  styleUrls: ['./post-images.component.css']
})
export class PostImagesComponent {
  @Input() images!: string[];
  activeImage: number = 0;
  serverUrl = serverUrl;
}
