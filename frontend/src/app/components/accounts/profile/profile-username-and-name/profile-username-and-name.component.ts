import { Component, Input } from '@angular/core';
import { User } from "../../../../models/user";

@Component({
  selector: 'app-profile-username-and-name',
  templateUrl: './profile-username-and-name.component.html',
  styleUrls: ['./profile-username-and-name.component.css']
})
export class ProfileUsernameAndNameComponent {
  @Input() user!: User;
}
