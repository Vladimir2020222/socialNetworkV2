import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../models/post";
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.css']
})
export class PostHeaderComponent implements OnInit {
  @Input() post!: Post;
  author: User | undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setAuthor();
  }

  setAuthor(): void {
    this.accountService.getUserById(this.post.author)
      .subscribe((author: User | null): void => {
        if (!author) return;
        this.author = author;
      });
  }
}
