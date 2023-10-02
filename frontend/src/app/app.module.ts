import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/accounts/profile/profile/profile.component';
import { HttpClientModule } from "@angular/common/http";
import { NgOptimizedImage } from "@angular/common";
import { LoginComponent } from './components/accounts/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
