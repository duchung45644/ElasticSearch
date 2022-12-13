import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from "@core/bootstrap/config.service";


import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CommuneService } from './commune.service';
import { PageEvent,MatPaginatorIntl } from '@angular/material/paginator';

import { Commune } from "../../../models/commune";
import { CreateCommuneComponent } from "./commune-form.component";

@Component({
  selector: 'app-commune',
  templateUrl: './commune.component.html',
  styleUrls: ['./commune.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommuneService],
})
export class CommuneComponent implements OnInit {
  columns: MtxGridColumn[] = [

   { header: 'Mã', field: 'Id', width: '30px', hide: true },
    { header: 'Tên', field: 'Name', width: '300px', sortable: true },
    { header: 'Mã', field: 'Code', sortable: true },
    { header: 'Tỉnh/Thành', field: 'ProvinceName', sortable: true },
    { header: 'Quận/Huyện', field: 'DistrictName', sortable: true },
    { header: 'Mô Tả', field: 'Desciption', hide: true },
   // {
     // header: 'Khoá',
     // field: 'IsLocked',
      // type: 'tag',
      // tag: {
      //   false: { text: 'Hoạt động', color: 'green-100' },
      //   true: { text: 'Dừng', color: 'red-100' },
      // },
   // },
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
          tooltip: 'Cập Nhật',
          type: 'icon',
          click: record => this.editCommune(record),
        },
        {
          icon: 'delete',
          tooltip: 'Xoá',
          color: 'warn',
          type: 'icon',
          pop: true,
          popTitle: 'Xác nhận xoá ?',
          click: record => this.deleteCommune(record),
        },
      ],
    },
  ];
  list = [];
  total = 0;
  isLoading = false;

  viewId: number;

  message: string;
  apiBaseUrl :string;
  showSearch = false;
  commune: Commune;
  activeCommunes: any;
  provinceList: any;
  districtList: any;
  query = {
    KeyWord: '',
    ProvinceId: null,
    DistrictId: null,
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
  constructor(private communeService: CommuneService,
    private config: ConfigService,
    public _MatPaginatorIntl: MatPaginatorIntl,

    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MtxDialog
  ) {
    this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 của ${length }`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} của ${length}`;
    };
    var conf = this.config.getConfig();
    this.apiBaseUrl =conf.apiBaseUrl;
    this.query.PageSize = conf.pageSize;

  }

  ngOnInit() {
    this.getData();
    this.getSearchData();
    this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';

  }

  getData() {
    this.isLoading = true;
    this.communeService.getByPage(this.params).subscribe((res: any) => {
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
    this.getAllProvince();
  }

  clearsearch() {
    this.query.PageIndex = 0;
    this.query.KeyWord = '';
    this.query.ProvinceId = null;
    this.query.DistrictId = null;
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


  getDistrictByProvice($event) {
    this.query.DistrictId = null;
    if (this.query.ProvinceId > 0) {
      this.communeService.getDistrictByProvince({ Id: this.query.ProvinceId }).subscribe((data: any) => {
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

  newCommune() {
    this.setViewId(0);
    const dialogRef = this.dialog.originalOpen(CreateCommuneComponent, {
      width: '1000px',
      data: { viewId: 0 },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });
  }

  setViewId(id) {
    this.viewId = id;
  }
  // viewCommune(id) {
  //   this.setViewId(id);
  //   this.communeService.getbyid({ Id: id }).subscribe((data: any) => {
  //     this.commune = data.Data;
  //   });
  // }
  deleteCommune(value: any) {

    this.communeService.deleteCommune({ Id: value.Id }).subscribe((data: any) => {
      this.getData();
      this.toastr.success(`Đã xoá ${value.CommuneName}!`);
    });

  }

  editCommune(value: any) {
    this.setViewId(value.Id);
    const dialogRef = this.dialog.originalOpen(CreateCommuneComponent, {
      width: '1000px',
      data: { viewId: value.Id },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result == "1") this.getData();
    });

  }
  testExport(){
    
    window.open(`${this.apiBaseUrl}report/DownloadExcelReportInventory?id=12312`, "_blank");
  }


}
