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
import { PostsComponent } from './components/posts/posts/posts.component';
import { PostComponent } from './components/posts/post/post/post.component';
import { PostImagesComponent } from "./components/posts/post/post-images/post-images.component";
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { ProfilePostsComponent } from "./components/posts/profile-posts/profile-posts.component";
import { CommentComponent } from './components/posts/comments/comment/comment.component';
import { CommentRepliesComponent } from './components/posts/comments/comment-replies/comment-replies.component';
import { LikeableRateComponent } from './components/posts/likeable-rate/likeable-rate.component';
import { CommentsComponent } from './components/posts/comments/comments/comments.component';
import { CommentReplyComponent } from './components/posts/comments/comment-reply/comment-reply.component';
import { PostHeaderComponent } from './components/posts/post/post-header/post-header.component';


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
    PostHeaderComponent,
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
