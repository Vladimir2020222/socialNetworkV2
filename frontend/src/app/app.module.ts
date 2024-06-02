import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/accounts/profile/profile/profile.component';
import { HttpClientModule } from "@angular/common/http";
import { NgOptimizedImage } from "@angular/common";
import { LoginComponent } from './components/accounts/login/login.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogoutComponent } from './components/accounts/logout/logout.component';
import { SignupComponent } from "./components/accounts/signup/signup.component";
import { ProfileUserAvaComponent } from './components/accounts/profile/profile-user-ava/profile-user-ava.component';
import {
  ProfileUsernameAndNameComponent
} from './components/accounts/profile/profile-username-and-name/profile-username-and-name.component';
import {
  ProfileChangeAvaComponent
} from "./components/accounts/profile/profile-change-ava/profile-change-ava.component";
import { CenterContentComponent } from "./components/center-content/center-content.component";
import { ChangeProfileComponent } from './components/accounts/change-profile/change-profile.component';
import { ConfirmChangeEmailComponent } from './components/accounts/confirm-change-email/confirm-change-email.component';
import { ChangePasswordComponent } from './components/accounts/passwords/change-password/change-password.component';
import { ResetPasswordComponent } from './components/accounts/passwords/reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './components/accounts/passwords/reset-password-confirm/reset-password-confirm.component';
import {
  ProfileUserStatsComponent
} from "./components/accounts/profile/profile-user-stats/profile-user-stats.component";
import { ProfileSubscribeButtonComponent } from './components/accounts/profile/profile-subscribe-button/profile-subscribe-button.component';
import { CurrentUserProfileComponent } from './components/accounts/current-user-profile/current-user-profile.component';
import { UserProfileComponent } from './components/accounts/user-profile/user-profile.component';
import { PostsComponent } from './components/feed/posts/posts.component';
import { PostComponent } from './components/feed/post/post/post.component';
import { PostImagesComponent } from "./components/feed/post/post-images/post-images.component";
import { CreatePostComponent } from './components/feed/create-post/create-post.component';
import { ProfilePostsComponent } from "./components/feed/profile-posts/profile-posts.component";
import { CommentComponent } from './components/feed/comments/comment/comment.component';
import { CommentRepliesComponent } from './components/feed/comments/comment-replies/comment-replies.component';
import { LikeableRateComponent } from './components/feed/likeable-rate/likeable-rate.component';
import { CommentsComponent } from './components/feed/comments/comments/comments.component';
import { CommentReplyComponent } from './components/feed/comments/comment-reply/comment-reply.component';
import { AuthorMixinHeaderComponent } from "./components/feed/author-mixin-header/author-mixin-header.component";
import { ReplyFormComponent } from './components/feed/comments/forms/reply-form/reply-form.component';
import { CommentFormComponent } from './components/feed/comments/forms/comment-form/comment-form.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu/navigation-menu.component';
import { NavigationMenuOptionComponent } from './components/navigation-menu/navigation-menu-option/navigation-menu-option.component';
import {
  EditReplyCommentFormComponent
} from "./components/feed/comments/forms/edit-reply-comment-form/edit-reply-comment-form.component";
import {EditCommentFormComponent} from "./components/feed/comments/forms/edit-comment-form/edit-comment-form.component";
import { EditPostComponent } from './components/feed/edit-post/edit-post.component';
import { NotificationsComponent } from './components/notifications/notifications/notifications.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    ProfileUserAvaComponent,
    ProfileChangeAvaComponent,
    ProfileUsernameAndNameComponent,
    CenterContentComponent,
    ChangeProfileComponent,
    ConfirmChangeEmailComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    ProfileUserStatsComponent,
    ProfileSubscribeButtonComponent,
    CurrentUserProfileComponent,
    UserProfileComponent,
    PostsComponent,
    PostComponent,
    PostImagesComponent,
    CreatePostComponent,
    ProfilePostsComponent,
    CommentComponent,
    CommentRepliesComponent,
    LikeableRateComponent,
    CommentsComponent,
    CommentReplyComponent,
    AuthorMixinHeaderComponent,
    ReplyFormComponent,
    CommentFormComponent,
    EditReplyCommentFormComponent,
    EditCommentFormComponent,
    NavigationMenuComponent,
    NavigationMenuOptionComponent,
    EditPostComponent,
    NotificationsComponent,
    NotificationComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
