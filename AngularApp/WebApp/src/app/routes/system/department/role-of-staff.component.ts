import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConfigService } from "@core/bootstrap/config.service";

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from "./department.service";

import { Department } from "../../../models/acc/department";
import { Role } from 'app/models/acc/role';
@Component({
    selector: 'role-of-staff-form',
    styles: [
        `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './role-of-staff.component.html',
})
export class RoleOfStaffComponent {

    viewId: any;
    loadingContent: boolean;
    department: any;
    rightService: any;
    nodes: any;
    KeyNodeSelected: number;
    staff: any;
    roles: Role[];

    constructor(private departmentService: DepartmentService,
        private config: ConfigService,
        private cdr: ChangeDetectorRef,
        public dialog: MtxDialog,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<RoleOfStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.viewId = data.viewId;
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        
        this.loadingContent = true;
        this.departmentService.getStaffById({ Id: this.viewId }).subscribe((data: any) => {
            this.staff = data.Data;
            this.roles = data.Roles;
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    onClose(): void {
        this.dialogRef.close(0);
    }
    onSubmitRoleOfStaff(dataRight) {
        
        var roles = [];
        for (var i = 0; i < this.roles.length; i++) {
            var role = this.roles[i];
            if (role.Selected) {
                roles.push(role.Id);
            }
        }
        var data = {
            Id: this.viewId,
            InsertRoles: roles
        };
        this.departmentService.saveRoleOfStaff(data).subscribe((data: any) => {
            this.toastr.success(`Phân quyền cho cán bộ Thành công`);
            this.dialogRef.close(1);
        });

    }

}