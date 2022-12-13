import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ProvinceService } from './province.service';

import { PageEvent } from '@angular/material/paginator';

import { Province } from "../../../models/province";
@Component({
    selector: 'dialog-province-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './dialog-province-form.html',
  })
  export class CreateProvinceComponent {
    province: Province ;
    provinceList: any;
    viewId: any;
    constructor(
      private provinceService: ProvinceService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateProvinceComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.viewId = data.viewId;
      this.province = new Province();
    }
  
    ngOnInit() {
      this.getData();
    }
  
    getData() {
      this.province = new Province();
      if (this.viewId > 0) {
        this.provinceService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.province = data.Data;
        });
      };
      this.getAllProvince();
    }
    
    getAllProvince() {
      this.provinceService.getall({}).subscribe((data: any) => {
        this.provinceList = data.Data.Provinces;
      });
    }
    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataProvince) {
      var data = {
        Id: this.province.Id,
        Code: this.province.Code,
        Name: this.province.Name,
        Desciption: this.province.Desciption,
        IsLocked: this.province.IsLocked,
        VnPostCode: this.province.VnPostCode
      };
  
      this.provinceService.saveprovince(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });
  
    }
  
  }