import { Component, Input } from '@angular/core';
import { LikeableRateEnum } from "../../../enums/likeable-rate";
import { Likeable } from "../../../models/likeable";
import { PostService } from "../../../services/post.service";
import { likeableObjectsNames } from "../../../types/likeable-objects-names";

@Component({
  selector: 'app-likeable-rate',
  templateUrl: './likeable-rate.component.html',
  styleUrls: ['./likeable-rate.component.css']
})
export class LikeableRateComponent {
  @Input() object!: Likeable;
  @Input() objectName!: likeableObjectsNames;
  protected readonly LikeableRateEnum = LikeableRateEnum;

  constructor(private postService: PostService) {}

  likeClick(): void {
    if (this.object.current_user_rate === LikeableRateEnum.like) {
      this.postService.removeLike(this.object.pk, this.objectName);
      this.object.current_user_rate = LikeableRateEnum.none;
      this.object.likes--;
    } else {
      this.postService.like(this.object.pk, this.objectName);
      if (this.object.current_user_rate === LikeableRateEnum.dislike)
        this.object.dislikes--;
      this.object.current_user_rate = LikeableRateEnum.like;
      this.object.likes++;
    }
  }

  dislikeClick(): void {
    if (this.object.current_user_rate === LikeableRateEnum.dislike) {
      this.postService.removeDislike(this.object.pk, this.objectName);
      this.object.current_user_rate = LikeableRateEnum.none
      this.object.dislikes--;
    } else {
      this.postService.dislike(this.object.pk, this.objectName);
      if (this.object.current_user_rate === LikeableRateEnum.like)
        this.object.likes--;
      this.object.current_user_rate = LikeableRateEnum.dislike;
      this.object.dislikes++;
    }
  }
}
