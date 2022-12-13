import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from "@core/bootstrap/config.service";

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ShelfService } from './shelf.service';
import { PageEvent,MatPaginatorIntl } from '@angular/material/paginator';

import { Shelf } from "../../../models/Shelf";

import { Warehouse } from "../../../models/Warehouse";
@Component({
  selector: 'dialog-shelf-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-shelf-form.html',
})
export class CreateShelfComponent {
  shelf: Shelf;
  activeShelfs: any;
  warehouse: Warehouse;
  activeWarehouses: any;
  categoryList:any;
  warehouseList: any;
  warehouseTree: any;
  statusList=[
    {Status:true,StatusName:'Hoạt Động'},
    {Status:false,StatusName:'Dừng hoạt động'}
  ];
  KeyNodeSelected: number;
  viewId:any;
  listParent: any;
  listLevel: any;
  query = {
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc',
    WarehouseId:'',
    ShelfTypeId:''
  };
  isShelf: boolean;
  ListParents: any;
 

  get params() {
    const p = Object.assign({}, this.query);
    p.PageIndex += 1;
    return p;
  }
  constructor(
    private shelfService: ShelfService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateShelfComponent>,
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    public dialog: MtxDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    var conf = this.config.getConfig();
    this.warehouse = new Warehouse();
    this.shelf=new Shelf();
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
    this.listLevel = data.Data.Levels
      // this.categoryList=data.Data.Categorys;
     
      });
      this.getAllCategory();

    

  }
  reloadWarehouseTree() {
  
    this.shelfService.WarehouseTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
      this.warehouseList = data.Data.Warehouses;
      this.ListParents = data.Data.Parents;
      this.listLevel = data.Data.Levels
      // tree binding
      var tree = ($("#WarehouseTree") as any).fancytree('getTree');
      tree.reload(this.warehouseList);
    
      this.cdr.detectChanges();
    });
  }
  

  getData() {
    this.shelf = new Shelf();
    if (this.viewId > 0) {
      this.shelfService.getshelfbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.shelf = data.Data;
      });
    };
   
    this.getAllCategory();
    this.getall();
   
    
       }

       getAllCategory() {
        
        this.shelfService.GetAllCategory({}).subscribe((data: any) => {
          this.categoryList = data.Data.Shelf;
        });
      }
      getall(){
    
        this.shelfService.GetAllWarehouse({}).subscribe((data: any) => {
          this.warehouseList = data.Data.Warehouses;
        });
      }
    
    onSubmit(dataShelf) {

      var data = {
        Id: this.shelf.Id,
        WarehouseId: this.shelf.WarehouseId,
        Code: this.shelf.Code,
        ShelfName: this.shelf.ShelfName,
        
        Capacity: this.shelf.Capacity,
        Tonnage: this.shelf.Tonnage,
        Size: this.shelf.Size,
        SortOrder: this.shelf.SortOrder,
        Description: this.shelf.Description,
        Status: this.shelf.Status,
                ShelfTypeId: this.shelf.ShelfTypeId,
      };

      this.shelfService.saveshelf(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
        this.reloadWarehouseTree();
        this.getData();
      });

    }

  }

  