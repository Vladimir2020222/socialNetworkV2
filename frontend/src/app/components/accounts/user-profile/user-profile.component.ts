import { Component, OnInit } from '@angular/core';
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private accountService: AccountService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId: string = this.route.snapshot.paramMap.get('id') as string;
    this.accountService.getUserById(Number(userId))
      .subscribe((user: User | null): void => {this.user = user})
  }
}
