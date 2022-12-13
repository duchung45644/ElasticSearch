import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  SettingsService, TokenService, User } from '@core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  user: User;

  constructor(private settings: SettingsService,
    private token: TokenService,
    private router: Router) {
    this.user = settings.user;
  }

  logout() {
    this.token.clear();
    this.settings.removeUser();
    this.router.navigateByUrl('/login');
  }
}
