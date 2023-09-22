import { Component } from '@angular/core';
import { AccountService } from "../../../../services/account.service";


@Component({
  selector: 'app-profile-change-ava',
  templateUrl: './profile-change-ava.component.html',
  styleUrls: ['./profile-change-ava.component.css']
})
export class ProfileChangeAvaComponent {
  constructor(private accountService: AccountService) {}

  submit(files: FileList | null): void {
    if (!files) return;
    const file: File = Array.from(files)[0];
    this.accountService.changeAva(file);
  }
}
