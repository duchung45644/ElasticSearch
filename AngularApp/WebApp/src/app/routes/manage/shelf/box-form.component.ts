import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from "@core/bootstrap/config.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ShelfService } from './shelf.service';
import { PageEvent,MatPaginatorIntl } from '@angular/material/paginator';

import { Shelf } from "../../../models/Shelf";

import { Warehouse } from "../../../models/Warehouse";
import { Box } from "../../../models/Box";
@Component({
  selector: 'dialog-box-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-box-form.html',
})
export class CreateBoxComponent {
  shelf: Shelf;
  box:Box;
  activeShelfs: any;
  warehouse: Warehouse;
  activeWarehouses: any;
  categoryList:any;
  warehouseList: any;
  warehouseTree: any;
  KeyNodeSelected: number;
  shelfList:any;
  viewId:any;
  public Editor = ClassicEditor;
  statusList=[
    {Status:true,StatusName:'Hoạt Động'},
    {Status:false,StatusName:'Dừng hoạt động'}
  ];
  listParent: any;
  listLevel: any;
  query = {
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc',
    BoxId:'',
   
  };
  isShelf: boolean;
  ListParents: any;
  ListShelfParents: any;
 

  get params() {
    const p = Object.assign({}, this.query);
    p.PageIndex += 1;
    return p;
  }
  constructor(
    private shelfService: ShelfService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateBoxComponent>,
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    public dialog: MtxDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    var conf = this.config.getConfig();
    this.warehouse = new Warehouse();
    this.shelf=new Shelf();
    this.box=new Box();
    this.getWarehouseTree();
    this.isShelf=false;
  }

  ngOnInit() {
    this.getData();
    
   
  }
  getWarehouseTree() {
    this.shelfService.WarehouseTree({}).subscribe((data: any) => {
    this.warehouseList=data.Data.Warehouses;
    this.ListParents = data.Data.Parents;
    this.ListShelfParents = data.Data.ShelfParents;
    this.listLevel = data.Data.Levels
     
      });
      this.GetAllCategoryBox();

    

  }
  reloadWarehouseTree() {
  
    this.shelfService.WarehouseTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
      this.warehouseList = data.Data.Warehouses;
      this.ListParents = data.Data.Parents;
      this.ListShelfParents = data.Data.ShelfParents;
      this.listLevel = data.Data.Levels
       
      // tree binding
      var tree = ($("#WarehouseTree") as any).fancytree('getTree');
      tree.reload(this.warehouseList);
    
      this.cdr.detectChanges();
    });
  }
  

  getData() {
    this.box = new Box();
    if (this.viewId > 0) {
      this.shelfService.getboxbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.box = data.Data;
      });
    };
    this.GetAllCategoryBox();
    this.getall();
   
   
    
       }

       GetAllCategoryBox() {
        
        this.shelfService.GetAllCategoryBox({}).subscribe((data: any) => {
          this.categoryList = data.Data.Box;
        });
      }
      getall(){
    
        this.shelfService.getall({}).subscribe((data: any) => {
          this.shelfList = data.Data.Shelfs;
        });
      }
    onSubmit(dataBox) {

      var data = {
        Id: this.box.Id,
        ShelfId: this.box.ShelfId,
        Code: this.box.Code,
        BoxName: this.box.BoxName,
        
        Capacity: this.box.Capacity,
        Tonnage: this.box.Tonnage,
        Size: this.box.Size,
        SortOrder: this.box.SortOrder,
        Description: this.box.Description,
        Status: this.box.Status,
        BoxId: this.box.BoxId,
      };

      this.shelfService.savebox(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
        this.reloadWarehouseTree();
        this.getData();
      });

    }

  }

  