import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RecordtypeService } from './recordtype.service';
import { PageEvent } from '@angular/material/paginator';

import { Recordtype } from "../../../models/Recordtype";
@Component({
  selector: 'dialog-recordtype-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-recordtype-form.html',
})
export class CreateRecordTypeComponent {
    recordtype: Recordtype;
  positionList: any;
  viewId: any;
  constructor(
    private recordtypeService: RecordtypeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateRecordTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.recordtype = new Recordtype();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.recordtype = new Recordtype();
    if (this.viewId > 0) {
      this.recordtypeService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.recordtype = data.Data;
      });
    };
   
       }


    onSubmit(dataPosition) {

      var data = {
        Id: this.recordtype.Id,
        Code: this.recordtype.Code,
        Name: this.recordtype.Name,
        SortOrder: this.recordtype.SortOrder,
       
        Description: this.recordtype.Description,
       
      };

      this.recordtypeService.save(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });

    }

  }

