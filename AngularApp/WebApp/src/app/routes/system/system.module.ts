import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';

import { RightComponent } from './right/right.component';
import { CreateRightComponent } from "./right/right-form.component";
import { RoleComponent, CreateRoleComponent } from "./role/role.component";

import { DepartmentComponent } from "../system/department/department.component";
import { ActionOfUnitComponent } from './department/action-of-unit.component';
import { RoleOfStaffComponent } from './department/role-of-staff.component';
const COMPONENTS = [
  RightComponent, RoleComponent, DepartmentComponent,
];
const COMPONENTS_DYNAMIC = [RightComponent, CreateRightComponent,
  CreateRoleComponent, ActionOfUnitComponent,
  RoleOfStaffComponent
];

@NgModule({
  imports: [SharedModule, SystemRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SystemModule { }
