import { Component } from '@angular/core';
import {NavigationMenuOptionData} from "../../../interface/navigation-menu-option-data";

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent {
  options: NavigationMenuOptionData[] = [
    {
      title: 'profile',
      href: '/accounts/profile',
      ifLoggedIn: true
    },
    {
      title: 'login',
      href: '/accounts/login',
      ifLoggedIn: false
    },
    {
      title: 'logout',
      href: '/accounts/logout',
      ifLoggedIn: true
    },
    {
      title: 'sign up',
      href: '/accounts/signup',
      ifLoggedIn: false
    },
    {
      title: 'change profile',
      href: '/accounts/change_profile',
      ifLoggedIn: true
    },
    {
      title: 'feed',
      href: '/feed',
    },
    {
      title: 'create new post',
      href: 'create_post',
      ifLoggedIn: true
    },
    {
      title: 'notifications',
      href: 'notifications',
      ifLoggedIn: true
    }
  ];
}
