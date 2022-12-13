import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from "@core/bootstrap/config.service";


import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { HouseService } from './house.service';
import { PageEvent } from '@angular/material/paginator';

import { House } from "../../../../models/House";
import { CreateHouseComponent } from "./house-form.component";

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HouseService],
})
export class HouseComponent implements OnInit {
  columns: MtxGridColumn[] = [

    { header: '#ID', field: 'intCategoriesID', width: '30px', sortable: true },
    { header: 'Tên', field: 'txtCategoriesname', width: '300px', sortable: true },
    { header: 'Mô tả', field: 'txtCategoriesDesc' ,hide : true},
    { header: 'Tên viết tắt', field: 'Abstract',  sortable: true },
    { header: 'Đơn vị đo', field: 'Measure',  sortable: true },
    { header: 'Thời gian sử dụng', field: 'TimeUsed',  sortable: true },
    { header: 'Tỉ lệ tính hao mòn', field: 'AttritionRate',  sortable: true },

    {
    
      header: 'Thao Tác',
      field: 'option',
      width: '120px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          icon: 'edit',
          tooltip: 'sửa',
          type: 'icon',
          click: record => this.editHouse(record),
        },
        {
          icon: 'delete',
          tooltip: 'Xoá',
          color: 'warn',
          type: 'icon',
          pop: true,
          popTitle: 'Xác nhận xoá ?',
          click: record => this.deleteHouse(record),
        },
      ],
    },
  ];
  list = [];
  total = 0;
  isLoading = false;

  viewId: number;

  message: string;

  showSearch = false;
  house: House;
  query = {
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc'
  };

  get params() {
    const p = Object.assign({}, this.query);
    p.PageIndex += 1;
    return p;
  }
  constructor(private houseService: HouseService,
    private config: ConfigService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MtxDialog
  ) {
    var conf = this.config.getConfig();
    this.query.PageSize = conf.pageSize;

  }

  ngOnInit() {
    this.getData();
    this.getSearchData();
  }

  getData() {
    this.isLoading = true;
    this.houseService.getByPage(this.params).subscribe((res: any) => {
      this.list = res.Data.ListObj;
      this.total = res.Data.Pagination.NumberOfRows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }


  getNextPage(e: PageEvent) {
    this.query.PageIndex = e.pageIndex;
    this.query.PageSize = e.pageSize;
    this.getData();
  }

  getSearchData() {
    this.getData();
  }

  clearsearch() {
    this.query.PageIndex = 0;
    this.query.KeyWord = '';
    this.query.SortField = '';
    this.query.SortDirection = 'desc';
    this.getData();
  }
  search() {
    this.query.PageIndex = 0;
    this.getData();
  }

  changeSort(e: any) {
    this.query.SortField = e.active;
    this.query.SortDirection = e.direction;
    this.search();
  }
  rowSelectionChangeLog(e: any) {
    console.log(e);
  }

  newHouse() {
    this.setViewId(0);
    const dialogRef = this.dialog.originalOpen(CreateHouseComponent, {
      width: '1000px',
      data: { viewId: 0 },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  setViewId(houseid) {
    this.viewId = houseid;
  }
  // viewHouse(id) {
  //   this.setViewId(id);
  //   this.houseService.getbyid({ Id: id }).subscribe((data: any) => {
  //     this.house = data.Data;
  //   });
  // }
  deleteHouse(value: any) {
    this.houseService.deleteHouse({ id: value.intCategoriesID }).subscribe((data: any) => {
      this.getData();
      this.toastr.success(`Đã xoá ${value.txtCategoriesname}!`);
    });

  }

  editHouse(value: any) {
    this.setViewId(value.intCategoriesID);
    const dialogRef = this.dialog.originalOpen(CreateHouseComponent, {
      width: '1000px',
      data: { viewId: value.intCategoriesID },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }
}
