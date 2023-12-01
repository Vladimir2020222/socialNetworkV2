import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { AuthorMixin } from "../../../models/author-mixin";
import { PubUpdDateMixin } from "../../../models/pub-upd-date-mixin";
import { getBackendDatetimeAge } from "../../../utils";

@Component({
  selector: 'app-author-mixin-header',
  templateUrl: './author-mixin-header.component.html',
  styleUrls: ['./author-mixin-header.component.css']
})
export class AuthorMixinHeaderComponent implements OnInit {
  @Input() object!: AuthorMixin & PubUpdDateMixin;
  author: User | undefined;
  pubAge!: string;
  updAge!: string;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setAuthor();
    this.setPubAndUpdAges();
  }

  setPubAndUpdAges(): void {
    this.pubAge = getBackendDatetimeAge(this.object.pub_date);
    this.pubAge = getBackendDatetimeAge(this.object.upd_date);
  }

  setAuthor(): void {
    this.accountService.getUserById(this.object.author)
      .subscribe((author: User | null): void => {
        if (!author) return;
        this.author = author;
      });
  }
}
