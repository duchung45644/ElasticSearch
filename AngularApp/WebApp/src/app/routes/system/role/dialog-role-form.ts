// import { Component, Inject, OnInit } from '@angular/core';
// import { NgForm, FormGroup, FormBuilder } from '@angular/forms';

// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// import { ToastrService } from 'ngx-toastr';
// import { RoleService } from './role.service';

// import { Role } from "../../../models/role";

// @Component({
//     selector: 'app-forms-role',
//     templateUrl: './dialog-role-form.html',
//     styles: [
//         `
//           .demo-full-width {
//             width: 100%;
//           }
//         `,
//     ],
// })
// export class CreateRoleComponent implements OnInit {
//     role: any;
//     constructor(
//         private roleService: RoleService,
//         private toastr: ToastrService,
//         public dialogRef: MatDialogRef<CreateRoleComponent>,
//         @Inject(MAT_DIALOG_DATA) public data: any
//     ) {

//         this.role = new Role();
//     }


//     ngOnInit() {}

//     onClose(): void {
//         this.dialogRef.close();
//     }
//     onSubmit(dataRole) {
//         
//         var data = {
//             RoleId: dataRole.RoleId,
//             RoleActivated: dataRole.RoleActivated,
//             RoleName: dataRole.RoleName,
//             RoleDesc: dataRole.RoleDesc,
//             Rights: this.role.Rights
//         };

//         this.roleService.saverole(data).subscribe(() => {
//             this.toastr.success(`Thành công`);
//             this.dialogRef.close();
//         });

//     }
// }

