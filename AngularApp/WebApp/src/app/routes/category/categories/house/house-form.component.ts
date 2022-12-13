import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { HouseService } from './house.service';

import { PageEvent } from '@angular/material/paginator';

import { House } from "../../../../models/House";
@Component({
    selector: 'dialog-house-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './dialog-house-form.html',
  })
  export class CreateHouseComponent {
    house: House ;
    houseList: any;
    viewId: any;
    constructor(
      private houseService: HouseService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateHouseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.viewId = data.viewId;
      this.house = new House();
    }
  
    ngOnInit() {
      this.getData();
    }
  
    getData() {
      this.house = new House();
      if (this.viewId > 0) {
        this.houseService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.house = data.Data;
        });
      };
      this.getAllHouse();
    }
    
    getAllHouse() {
      this.houseService.getall({}).subscribe((data: any) => {
        this.houseList = data.Data.Houses;
      });
    }
    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataHouse) {
      var data = {
        intCategoriesID: this.house.intCategoriesID,
        txtCategoriesname: this.house.txtCategoriesname,
        
        txtCategoriesDesc: this.house.txtCategoriesname,
        visible: this.house.visible,
        intCanDelete: this.house.intCanDelete,
        intlevel: this.house.intlevel,
        intDisplayOrder: this.house.intDisplayOrder,
        Abstract: this.house.Abstract,
        CateID: this.house.CateID,
        Measure: this.house.Measure,
        TimeUsed: this.house.TimeUsed,
        AttritionRate: this.house.AttritionRate,
        AttritionType: this.house.AttritionType,
        GroupType: this.house.GroupType,
        txtparent: this.house.txtparent,
      };
  
      this.houseService.savehouse(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });
  
    }
  
  }