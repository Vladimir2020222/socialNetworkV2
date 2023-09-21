import { Component } from '@angular/core';
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-change-ava',
  templateUrl: './change-ava.component.html',
  styleUrls: ['./change-ava.component.css']
})
export class ChangeAvaComponent {
  constructor(private accountService: AccountService) {}

  submit(files: FileList | null): void {
    if (!files) return;
    const file: File = Array.from(files)[0];
    this.accountService.changeAva(file);
  }
}
