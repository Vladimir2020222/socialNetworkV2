import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { Post } from "../../../models/post";
import { Comment } from "../../../models/comment";
import { CommentReply } from "../../../models/comment-reply";
import { getBackendDatetimeAge } from "../../../utils";
import {FeedService} from "../../../services/feed.service";

@Component({
  selector: 'app-author-mixin-header',
  templateUrl: './author-mixin-header.component.html',
  styleUrls: ['./author-mixin-header.component.css']
})
export class AuthorMixinHeaderComponent implements OnInit {
  @Input() object!: Post | Comment | CommentReply;
  @Input() objectName!: string;
  author: User | undefined;
  currentUserIsAuthor: boolean = false;
  showDeleteFailedMessage: boolean = false;
  pubAge!: string;
  updAge!: string;

  constructor(private accountService: AccountService, private feedService: FeedService) {}

  ngOnInit(): void {
    this.setAuthor();
    this.setPubAndUpdAges();
  }

  setPubAndUpdAges(): void {
    this.pubAge = getBackendDatetimeAge(this.object.pubDate);
    this.pubAge = getBackendDatetimeAge(this.object.updDate);
  }

  setAuthor(): void {
    this.accountService.getUserById(this.object.author)
      .subscribe((author: User | null): void => {
        if (!author) return;
        this.author = author;
        this.accountService.userProfile
          .subscribe((currentUser: User | null): void => {
            if (!currentUser) return;
            this.currentUserIsAuthor = currentUser.pk === author.pk;
          })
      });
  }

  deleteObject(): void {
    this.feedService.deleteObject(this.object.pk, this.objectName)
      .subscribe(success => {
        this.showDeleteFailedMessage = !success;
      });
  }
}
