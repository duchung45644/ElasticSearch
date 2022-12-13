import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ConfigService, SettingsService, TokenService, User } from '@core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  user: User;
  fileBaseUrl: string;

  constructor(
    private router: Router,
    private settings: SettingsService,
    private config: ConfigService,
    private token: TokenService
  ) {
    
    var conf = this.config.getConfig();
    
    this.fileBaseUrl = conf.fileBaseUrl;
    
    this.user = settings.user;
    if    (this.user.Image == undefined || this.user.Image == '' ){
    this.user.Image = '/Resources/Images/NoImage.png';
  }
    console.log(this.user );
  }

  logout() {
    this.token.clear();
    this.settings.removeUser();
    this.router.navigateByUrl('/login');
  }
}
