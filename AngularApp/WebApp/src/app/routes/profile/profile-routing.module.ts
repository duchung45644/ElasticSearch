import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { UserProfileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
  { path: 'user', component: UserProfileComponent, data: { title: 'Thông tin tài khoản' } },
  { path: 'changepassword', component: ChangePasswordComponent, data: { title: 'Thông tin tài khoản' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
