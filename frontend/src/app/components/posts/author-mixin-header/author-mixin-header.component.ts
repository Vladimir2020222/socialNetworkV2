import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { AuthorMixin } from "../../../models/author-mixin";

@Component({
  selector: 'app-author-mixin-header',
  templateUrl: './author-mixin-header.component.html',
  styleUrls: ['./author-mixin-header.component.css']
})
export class AuthorMixinHeaderComponent implements OnInit {
  @Input() object!: AuthorMixin;
  author: User | undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setAuthor();
  }

  setAuthor(): void {
    this.accountService.getUserById(this.object.author)
      .subscribe((author: User | null): void => {
        if (!author) return;
        this.author = author;
      });
  }
}
