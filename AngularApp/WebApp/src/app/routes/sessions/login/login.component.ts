import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService, StartupService, TokenService } from '@core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  private sub: any;
  next: string;
  loadingContent = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private token: TokenService,
    private startup: StartupService,
    private settings: SettingsService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.route.queryParams.subscribe(params => {
      this.next = params['next'];
    });
  }
  ngOnInit() {
    this.loadingContent = false;
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      var data = {
        username: this.loginForm.get('username').value,
        password: this.loginForm.get('password').value
      };
      this.loadingContent = true;
      this.authService.login(data).subscribe((data: any) => {
        //this.route.navigate([environment.baseUrl + data.redirectUrl]);

        // Set user info
        this.settings.setUser(data);
        // Set token info
        this.token.set({ token: data.Data.Token, key: data.Data.UserId });
        // Regain the initial data
        this.startup.load().then(() => {
          console.log(this.next);

          let url = '/';
          if (this.next != undefined && this.next != null && this.next != '/') {
            url = this.next;
          }
          // let url = this.token.referrer!.url || '/';
          // if (url.includes('/auth')) {
          //   url = '/';
          // }
          this.router.navigateByUrl(url);
          this.loadingContent = false;
        });

      },
        error => {

          this.loadingContent = false;
        });
    }

  }
}
