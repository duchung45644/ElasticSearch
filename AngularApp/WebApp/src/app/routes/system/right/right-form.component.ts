import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RightService } from './right.service';
import { PageEvent } from '@angular/material/paginator';

import { Right } from "../../../models/acc/right";
@Component({
    selector: 'dialog-right-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './dialog-right-form.html',
  })
  export class CreateRightComponent {
    right: any;
    rightList: any;
    viewId: any;
  rightTree: any;
    constructor(
      private rightService: RightService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateRightComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.viewId = data.viewId;
      this.right = new Right();
    }
  
    ngOnInit() {
      this.getData();
    }
  
    getData() {
      this.right = new Right();
      if (this.viewId > 0) {
        this.rightService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.right = data.Data;
        });
      };
      this.getRightTree();
    }
    getRightTree() {
      this.rightService.getRightTree({}).subscribe((data: any) => {
        this.rightList = data.Data.Rights;
        this.rightTree = data.Data.RightTree;
      });
    }
    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataRight) {
      var data = {
        Id: this.right.Id,
        ParentId: this.right.ParentId,
        Name: this.right.Name,
        ShowMenu: true,
        SortOrder: this.right.SortOrder,
        NameOfMenu: this.right.NameOfMenu,
        ActionLink: this.right.ActionLink,
        IsLocked: this.right.IsLocked
      };
  
      this.rightService.saveright(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });
  
    }
  
  }