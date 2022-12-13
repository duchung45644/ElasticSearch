import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RightComponent } from "../system/right/right.component";

import { RoleComponent } from "../system/role/role.component";
import { DepartmentComponent } from "../system/department/department.component";
const routes: Routes = [
  { path: 'right', component: RightComponent, data: { title: 'Chức năng' } },

  { path: 'role', component: RoleComponent, data: { title: 'Vai trò' } },
  { path: 'department', component: DepartmentComponent, data: { title: 'Phòng ban/đơn vị' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
