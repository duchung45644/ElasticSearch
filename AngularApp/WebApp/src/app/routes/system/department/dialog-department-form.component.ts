// import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef }
//   from '@angular/core';
// import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// import { MtxDialog } from '@ng-matero/extensions/dialog';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// import { ToastrService } from 'ngx-toastr';
// import { MtxGridColumn } from '@ng-matero/extensions';

// import { PageEvent } from '@angular/material/paginator';

// import { ConfigService } from "@core/bootstrap/config.service";


// import { Department } from "../../../models/acc/department";
// import { DepartmentService } from './department.service';
 
// @Component({
//   selector: 'dialog-department-form',
//   styles: [
//     `
//       .demo-full-width {
//         width: 100%;
//       }
//     `,
//   ],
//   templateUrl: './dialog-department-form.html',
// })
// export class DepartmentFormComponent implements OnInit {
//   department: Department;

//   fileBaseUrl: string;
//   viewDepartmentId: number;
//   departmentList: any;
//   listParent: any;
  
//   constructor(private config: ConfigService,
//     private departmentService: DepartmentService,
//     private toastr: ToastrService,
//     public dialogRef: MatDialogRef<DepartmentFormComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {

//     var conf = this.config.getConfig();
//     this.fileBaseUrl = conf.fileBaseUrl;
//     this.viewDepartmentId = data.viewDepartmentId;
//     this.department = new Department();
//   }

//   ngOnInit() {
//     this.getData();
//   }

//   getData() {
//     this.department = new Department();
//     if (this.viewDepartmentId > 0) {
//       this.departmentService.getByid({ Id: this.viewDepartmentId }).subscribe((data: any) => {
//         this.department = data.Data;
//       });
//     }
//     this.getAllDepartment();
//   }

//   getAllDepartment() {
//     this.departmentService.getAllDepartment({}).subscribe((data: any) => {
//       this.listParent = data.Data;
//     });
//   }
   
//   onClose(): void {
//     this.dialogRef.close(0);
//   }
//   onSubmit(dataDepartment) {
//     var data = {
//       Id: this.department.Id,
//       Code: this.department.Code,
//       Name: this.department.Name,
//       /// thông tin post lên
//     };
//     this.departmentService.saveDepartment(data).subscribe((data: any) => {
//       this.toastr.success(`Thành công`);
//       this.dialogRef.close(1);
//     });

//   }
// }