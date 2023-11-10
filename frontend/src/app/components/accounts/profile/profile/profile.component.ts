import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from "../../../../models/user";
import { AccountService } from "../../../../services/account.service";
import { Post } from "../../../../models/post";
import { PostService } from "../../../../services/post.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() user!: User | null;
  userPosts: Post[] = []
  userPostsAmount: number = 5;
  userPostsOffset: number = 0;
  userIsCurrentUser: boolean = true;  // if it would be false by default, ProfileSubscribeButtonComponents would send
                                      // redundant request to server to check if current user is subscribed to this user
  constructor(private accountService: AccountService, private postService: PostService) {}

  ngOnInit(): void {
    this.accountService.userIsInitialized
      .subscribe(value => {
        if (value) {
          this.setUserIsCurrentUser();
        }
      })
    this.setUserPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setUserPosts();
  }

  setUserIsCurrentUser(): void {
    this.accountService.userProfile
      .subscribe((currentUserProfile: User | null): void => {
        if (currentUserProfile && this.user) {
          this.userIsCurrentUser = currentUserProfile?.pk === this.user.pk
        } // else element is not necessary because the userIsCurrentUser field is already false by default
      })
  }

  setUserPosts(): void {
    if (this.user) {
      this.postService.getPostsByUser(this.user.pk, this.userPostsOffset, this.userPostsAmount)
        .subscribe((posts: Post[]): void => {
          this.userPosts = posts;
        });
    }
  }
}
