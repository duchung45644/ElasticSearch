import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CategoriesService } from './categories.service';

import { PageEvent } from '@angular/material/paginator';

import { Categories } from "../../../models/Categories";
@Component({
    selector: 'dialog-categories-form',
    styles: [
      `
        .demo-full-width {
          width: 100%;
        
        }
        .mat-dialog-actions{
          max-height: 30px;
        }
      `,
    ],
    templateUrl: './dialog-categories-form.html',
  })
  export class CreateCategoriesComponent {
    categories: Categories ;
    parentList: any;
    houseList : any;
    AssetsID : any;
    

    

    viewId: any;
    constructor(
      private categoriesService: CategoriesService,
      private toastr: ToastrService,
      public dialogRef: MatDialogRef<CreateCategoriesComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.viewId = data.viewId;
      this.categories = new Categories();
    }
  
    ngOnInit() {
      this.getData();
      this.getAllCategories();
      this.getAllHouse();
    }
  
    getData() {
      this.categories = new Categories();
      if (this.viewId > 0) {
        this.categoriesService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
          this.categories = data.Data;
        });
      };
   
      
      
      
    
    }
    
    getAllCategories() {
      this.categoriesService.getall({}).subscribe((data: any) => {
        this.parentList = data.Data.Cates;
      });
    }

    getAllHouse() {
      this.categoriesService.getAllHouse({}).subscribe((data: any) => {
        this.houseList = data.Data.Houses;
      });
    }

  

    // getAllHouse() {
    //   this.categoriesService.getAllHouse({}).subscribe((data: any) => {
    //     this.houseList = data.Data.Houses;
    //   });
    // }

    

    onClose(): void {
      this.dialogRef.close(0);
    }
    onSubmit(dataCategories) {
      var data = {
        
        // AssetsLost: this.categories.AssetsLost,
        intCategoriesID : this.categories.intCategoriesID,
        txtCategoriesname : this.categories.txtCategoriesname,
        txtCategoriesDesc : this.categories.txtCategoriesDesc,
        Abstract : this.categories.Abstract,
        Measure : this.categories.Measure,
        TimeUsed : this.categories.TimeUsed,
        CateID: this.categories.CateID,
        ParentID : this.categories.ParentID,
      };
  
      this.categoriesService.savecategories(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      }); 
  this.getData();
    }
  
  }