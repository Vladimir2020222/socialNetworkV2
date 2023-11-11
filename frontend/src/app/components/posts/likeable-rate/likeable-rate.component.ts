import { Component, Input } from '@angular/core';
import { LikeableRateEnum } from "../../../enums/likeable-rate";
import { Likeable } from "../../../models/likeable";

@Component({
  selector: 'app-likeable-rate',
  templateUrl: './likeable-rate.component.html',
  styleUrls: ['./likeable-rate.component.css']
})
export class LikeableRateComponent {
  @Input() object!: Likeable;
  protected readonly LikeableRateEnum = LikeableRateEnum;
}
