import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ConditionService } from './condition.service';
import { PageEvent } from '@angular/material/paginator';

import { Condition } from "../../../models/condition";
@Component({
  selector: 'dialog-condition-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-condition-form.html',
})
export class CreateConditionComponent {
  condition: Condition;
  conditionList: any;
  viewId: any;
  constructor(
    private conditionService: ConditionService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.condition = new Condition();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.condition = new Condition();
    if (this.viewId > 0) {
      this.conditionService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.condition = data.Data;
      });
    };
   
       }


    onSubmit(dataCondition) {

      var data = {
        Id: this.condition.Id,
      
        ConditionName: this.condition.ConditionName,
        SortOrder: this.condition.SortOrder,
     
        Description: this.condition.Description,
   
      };

      this.conditionService.savecondition(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });

    }

  }

