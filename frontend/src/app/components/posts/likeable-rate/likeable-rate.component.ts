import { Component, Input } from '@angular/core';
import { LikeableRateEnum } from "../../../enums/likeable-rate";
import { Likeable } from "../../../models/likeable";
import { FeedService } from "../../../services/feed.service";
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

  constructor(private feedService: FeedService) {}

  likeClick(): void {
    if (this.object.currentUserRate === LikeableRateEnum.like) {
      this.feedService.removeLike(this.object.pk, this.objectName);
      this.object.currentUserRate = LikeableRateEnum.none;
      this.object.likes--;
    } else {
      this.feedService.like(this.object.pk, this.objectName);
      if (this.object.currentUserRate === LikeableRateEnum.dislike)
        this.object.dislikes--;
      this.object.currentUserRate = LikeableRateEnum.like;
      this.object.likes++;
    }
  }

  dislikeClick(): void {
    if (this.object.currentUserRate === LikeableRateEnum.dislike) {
      this.feedService.removeDislike(this.object.pk, this.objectName);
      this.object.currentUserRate = LikeableRateEnum.none
      this.object.dislikes--;
    } else {
      this.feedService.dislike(this.object.pk, this.objectName);
      if (this.object.currentUserRate === LikeableRateEnum.like)
        this.object.likes--;
      this.object.currentUserRate = LikeableRateEnum.dislike;
      this.object.dislikes++;
    }
  }
}
