import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { UserProfileComponent } from './userprofile/userprofile.component';
const COMPONENTS = [
  UserProfileComponent,ChangePasswordComponent
];
const COMPONENTS_DYNAMIC = [
];

@NgModule({
  imports: [SharedModule, ProfileRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class ProfileModule { }
