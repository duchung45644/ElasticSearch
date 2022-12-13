import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CommuneService } from './commune.service';

import { PageEvent } from '@angular/material/paginator';

import { Commune } from "../../../models/commune";
@Component({
    selector: 'dialog-commune-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './dialog-commune-form.html',
  })
  export class CreateCommuneComponent {
    commune: Commune ;
    communeList: any;
    provinceList:any;
    districtList:any;
    viewId: any;
    constructor(
      private communeService: CommuneService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateCommuneComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.viewId = data.viewId;
      this.commune = new Commune();
    }
  
    ngOnInit() {
      this.getData();
    }
  
    getData() {
      this.commune = new Commune();
      if (this.viewId > 0) {
        this.communeService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.commune = data.Data;
        });
      };
      this.getAllProvince();
    }
    
  getDistrictByProvice($event) {
    this.commune.DistrictId =null;
    if (this.commune.ProvinceId > 0) {
      this.communeService.getDistrictByProvince({Id:this.commune.ProvinceId}).subscribe((data: any) => {
        this.districtList = data.Data;
      });
    } else {
      this.districtList = [];
    }

  } 

    getAllProvince() {
      this.communeService.getAllProvince({}).subscribe((data: any) => {
        this.provinceList = data.Data.Provinces;
      });
    }
    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataCommune) {
     
      var data = {
        Id: this.commune.Id,
        Code: this.commune.Code,
        Name: this.commune.Name,
        DistrictId: this.commune.DistrictId,
        ProvinceId: this.commune.ProvinceId,
        Desciption: this.commune.Desciption,
        IsLocked: this.commune.IsLocked
      };
  
      this.communeService.savecommune(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });
  
    }
  
  }