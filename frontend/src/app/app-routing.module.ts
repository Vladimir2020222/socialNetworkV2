import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./components/accounts/profile/profile/profile.component";
import { LoginComponent } from "./components/accounts/login/login.component";
import { LogoutComponent } from "./components/accounts/logout/logout.component";
import { SignupComponent } from "./components/accounts/signup/signup.component";
import { ChangeProfileComponent } from "./components/accounts/change-profile/change-profile.component";

const routes: Routes = [
  {
    path: 'accounts/profile',
    component: ProfileComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
