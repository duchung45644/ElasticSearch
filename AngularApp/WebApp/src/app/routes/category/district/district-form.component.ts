import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { DistrictService } from './district.service';

import { PageEvent } from '@angular/material/paginator';

import { District } from "../../../models/district";
@Component({
    selector: 'dialog-district-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './dialog-district-form.html',
  })
  export class CreateDistrictComponent {
    district: District ;
    districtList: any;
    provinceList:any;
    
    viewId: any;
    constructor(
      private districtService: DistrictService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateDistrictComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    )
     {
      this.viewId = data.viewId;
      this.district = new District();
    }
  
    ngOnInit() {
      this.getData();
    }
  
    getData() {
      this.district = new District();
      if (this.viewId > 0) {
        this.districtService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.district = data.Data;
        });
      };
      this.getAllProvince();
    }
    
  //getDistrictByProvice($event) {
    //this.district.DistrictId =null;
  //   if (this.district.ProvinceId > 0) {
  //     this.districtService.getDistrictByProvince({Id:this.district.ProvinceId}).subscribe((data: any) => {
  //       this.districtList = data.Data;
  //     });
  //   } else {
  //     this.districtList = [];
  //   }

  // } 

    getAllProvince() {
      this.districtService.getAllProvince({}).subscribe((data: any) => {
        this.provinceList = data.Data.Provinces;
      });
    }
    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataDistrict) {
      var data = {
        Id: this.district.Id,
        Code: this.district.Code,
        Name: this.district.Name,
        // DistrictId: this.district.DistrictId,
        ProvinceId: this.district.ProvinceId,
        Desciption: this.district.Desciption,
        IsLocked: this.district.IsLocked,
        VnPostCode: this.district.VnPostCode
      };
  
      this.districtService.savedistrict(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });
  
    }
  
  }