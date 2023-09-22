import { Component, Input } from '@angular/core';
import { User } from "../../../../models/user";
import { serverUrl } from "../../../../constants";

@Component({
  selector: 'app-profile-user-ava',
  templateUrl: './profile-user-ava.component.html',
  styleUrls: ['./profile-user-ava.component.css']
})
export class ProfileUserAvaComponent {
  protected readonly serverUrl = serverUrl;
  @Input() user!: User;
  showChangeButton: boolean = false;
}
