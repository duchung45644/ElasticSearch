import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { FieldsService } from './fields.service';
import { PageEvent } from '@angular/material/paginator';

import { Fields } from "../../../models/fields";
@Component({
  selector: 'dialog-fields-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-fields-form.html',
})
export class CreateFieldsComponent {
    fields: Fields;
    fieldsList: any;
    fieldsTree:any;
  viewId: any;
  constructor(
    private fieldsService: FieldsService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.fields = new Fields();
  }

  ngOnInit() {
    this.getData();
  }
  getTree() {
    this.fieldsService.getTree({}).subscribe((data: any) => {
      this.fieldsList = data.Data.Fieldss;
      this.fieldsTree = data.Data.FieldsTree;
      
      
      });

      
    };
  
  getData() {
    this.fields = new Fields();
    if (this.viewId > 0) {
      this.fieldsService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.fields = data.Data;
      });
    };
   this.getTree();
       }


    onSubmit(dataFields) {

      var data = {
        Id: this.fields.Id,
        Code: this.fields.Code,
        Name: this.fields.Name,
        SortOrder: this.fields.SortOrder,
      
        Description: this.fields.Description,
        ParentId: this.fields.ParentId,
   
      };

      this.fieldsService.savefields(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });

    }

  }

