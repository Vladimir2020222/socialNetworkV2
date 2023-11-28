import { Component, Input } from '@angular/core';
import { LikeableRateEnum } from "../../../enums/likeable-rate";
import { Likeable } from "../../../models/likeable";
import { likeableObjectsNames } from "../../../constants";
import { PostService } from "../../../services/post.service";

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
    (this.object.current_user_rate === LikeableRateEnum.like ?
      this.postService.removeLike : this.postService.like)(this.object.pk, this.objectName);
  }

  dislikeClick(): void {
    (this.object.current_user_rate === LikeableRateEnum.like ?
      this.postService.removeDislike : this.postService.dislike)(this.object.pk, this.objectName);
  }
}
