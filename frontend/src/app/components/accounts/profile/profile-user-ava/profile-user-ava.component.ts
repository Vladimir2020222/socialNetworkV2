import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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
  @ViewChild('ava') ava!: ElementRef<HTMLImageElement>;
  @ViewChild('button') button!: ElementRef<HTMLDivElement>;

  mouseenter(event: MouseEvent): void {
    this.showChangeButton = true;
  }

  mouseleave(event: MouseEvent): void {
    // @ts-ignore
    const element = event.toElement;
    if (element !== this.ava.nativeElement)
      this.showChangeButton = false;
  }
}
