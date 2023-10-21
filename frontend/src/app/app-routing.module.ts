import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./components/accounts/profile/profile/profile.component";
import { LoginComponent } from "./components/accounts/login/login.component";
import { LogoutComponent } from "./components/accounts/logout/logout.component";
import { SignupComponent } from "./components/accounts/signup/signup.component";
import { ChangeProfileComponent } from "./components/accounts/change-profile/change-profile.component";
import { ConfirmChangeEmailComponent } from "./components/accounts/confirm-change-email/confirm-change-email.component";
import { ChangePasswordComponent } from "./components/accounts/passwords/change-password/change-password.component";
import { ResetPasswordComponent } from "./components/accounts/passwords/reset-password/reset-password.component";
import {
  ResetPasswordConfirmComponent
} from "./components/accounts/passwords/reset-password-confirm/reset-password-confirm.component";
import { CurrentUserProfileComponent } from "./components/accounts/current-user-profile/current-user-profile.component";
import { UserProfileComponent } from "./components/accounts/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: 'accounts/profile',
    component: CurrentUserProfileComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'user/:id',
    component: UserProfileComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/login',
    component: LoginComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/logout',
    component: LogoutComponent,
    data: {
      useMainContentWrapper: false
    }
  },
  {
    path: 'accounts/signup',
    component: SignupComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/change_profile',
    component: ChangeProfileComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/confirm_change_email/:token',
    component: ConfirmChangeEmailComponent,
  },
  {
    path: 'accounts/change_password',
    component: ChangePasswordComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/reset_password',
    component: ResetPasswordComponent,
    data: {
      useMainContentWrapper: true
    }
  },
  {
    path: 'accounts/reset_password_confirm/:uid/:token',
    component: ResetPasswordConfirmComponent,
    data: {
      useMainContentWrapper: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
