import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/accounts/profile/profile.component';
import { HttpClientModule } from "@angular/common/http";
import { NgOptimizedImage } from "@angular/common";
import { LoginComponent } from './components/accounts/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { LogoutComponent } from './components/accounts/logout/logout.component';
import { SignupComponent } from "./components/accounts/signup/signup.component";


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent
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
