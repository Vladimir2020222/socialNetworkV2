import { Component, Input } from '@angular/core';
import { User } from "../../../../models/user";

@Component({
  selector: 'app-profile-user-stats',
  templateUrl: './profile-user-stats.component.html',
  styleUrls: ['./profile-user-stats.component.css']
})
export class ProfileUserStatsComponent {
  @Input() user!: User;
}
