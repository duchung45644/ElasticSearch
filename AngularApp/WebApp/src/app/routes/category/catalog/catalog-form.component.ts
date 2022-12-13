import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CatalogService } from './catalog.service';
import { PageEvent } from '@angular/material/paginator';

import { Catalog } from "../../../models/catalog";
@Component({
  selector: 'dialog-catalog-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-catalog-form.html',
})
export class CreateCatalogComponent {
    catalog: Catalog;
    catalogList: any;
    catalogTree:any;
  viewId: any;
  constructor(
    private catalogService: CatalogService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.catalog = new Catalog();
  }

  ngOnInit() {
    this.getData();
  }
  getTree() {
    this.catalogService.getTree({}).subscribe((data: any) => {
      this.catalogList = data.Data.Catalogs;
      this.catalogTree = data.Data.CatalogTree;
      
      
      });

      
    };
  
  getData() {
    this.catalog = new Catalog();
    if (this.viewId > 0) {
      this.catalogService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.catalog = data.Data;
      });
    };
   this.getTree();
       }


    onSubmit(dataCatalog) {

      var data = {
        Id: this.catalog.Id,
        Code: this.catalog.Code,
        Name: this.catalog.Name,
        SortOrder: this.catalog.SortOrder,
      
        Description: this.catalog.Description,
        ParentId: this.catalog.ParentId,
   
      };

      this.catalogService.savecatalog(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });

    }

  }

