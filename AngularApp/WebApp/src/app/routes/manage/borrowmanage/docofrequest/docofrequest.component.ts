// import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { MtxDialog } from '@ng-matero/extensions/dialog';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ConfigService } from '@core/bootstrap/config.service';
// import { ToastrService } from 'ngx-toastr';
// import { MtxGridColumn } from '@ng-matero/extensions';
// import { DocofrequestService } from './Docofrequest.service';
// import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
// import { Docofrequest } from 'app/models/Docofrequest';
// import { CreateDocofrequestComponent } from './docofrequest-form.component';

// @Component({
//     selector: 'app-docofrequest',
//     templateUrl: './docofrequest.component.html',
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [DocofrequestService],
// })
// export class DocofrequestComponent implements OnInit {
//     columns: MtxGridColumn[] = [
//         { header: 'Tên hồ sơ', field: 'Title', width: '120px', sortable: true },
//         { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true },
//         {
//             header: 'Ngày mượn',
//             field: 'ReceiveDate',
//             width: '120px',
//             sortable: true,
//             type: 'date',
//             typeParameter: { format: 'dd/MM/yyyy ' },
//         },
//         {
//             header: 'Ngày hẹn trả',
//             field: 'AppointmentDate',
//             width: '120px',
//             sortable: true,
//             type: 'date',
//             typeParameter: { format: 'dd/MM/yyyy' },
//         },
//         {
//             header: 'Ngày trả',
//             field: 'ReimburseDate',
//             width: '120px',
//             sortable: true,
//             type: 'date',
//             typeParameter: { format: 'dd/MM/yyyy ' },
//         },
//         {
//             header: 'Trạng thái',
//             field: 'Status',
//             type: 'tag',
//             width: '120px',

//             tag: {
//                 0: { text: 'Mới đăng ký', color: 'green-100' },
//                 1: { text: 'Gửi yêu cầu đăng ký', color: 'red-100' },
//                 2: { text: 'Đã phê duyệt', color: 'red-100' },
//                 3: { text: 'Đã trả hết', color: 'red-100' },
//                 4: { text: 'Đã trả một phần', color: 'red-100' },
//                 5: { text: 'Đã hủy', color: 'red-100' },
//                 6: { text: 'Đã qua phê duyệt', color: 'red-100' },
//             },
//         },
//         {
//             header: 'Chức Năng',
//             field: 'option',
//             width: '50px',
//             pinned: 'right',
//             right: '0px',
//             type: 'button',
//             buttons: [
//                 // {
//                 //   icon: 'delete',
//                 //   tooltip: 'Hủy phiếu mượn',
//                 //   color: 'warn',
//                 //   type: 'icon',
//                 //   pop: true,
//                 //   popTitle: 'Xác nhận hủy ?',
//                 //   click: record => this.Delete(record),
//                 // },
//                 {
//                     icon: 'remove_red_eye',
//                     tooltip: 'Xem chi tiết',
//                     type: 'icon',
//                     click: (record) => this.Viewdocofrequest(record),
//                 },
//             ],
//         },
//     ];

//     list = [];
//     total = 0;
//     disableButton: boolean = true;
//     isLoading = false;
//     viewId: number;
//     message: string;
//     showSearch = false;
//     Docofrequest: Docofrequest;
//     activeRegistrasionlist: any;
//     provinceList: any;
//     fondList: any;
//     fileList: any;
//     listDocof: any;
//     listReigstration: any;
//     query = {
//         KeyWord: '',
//         PageIndex: 0,
//         PageSize: 20,
//         SortField: '',
//         SortDirection: 'desc',
//     };
//     listarray: any;

//     get params() {
//         const p = Object.assign({}, this.query);
//         p.PageIndex += 1;
//         return p;
//     }
//     constructor(
//         private docofrequestService: DocofrequestService,
//         private config: ConfigService,
//         public _MatPaginatorIntl: MatPaginatorIntl,
//         private cdr: ChangeDetectorRef,
//         private toastr: ToastrService,
//         public dialog: MtxDialog,
//     ) {
//         this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
//             if (length === 0 || pageSize === 0) {
//                 return `0 của ${length}`;
//             }
//             length = Math.max(length, 0);
//             const startIndex = page * pageSize;
//             // If the start index exceeds the list length, do not try and fix the end index to the end.
//             const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
//             return `${startIndex + 1} - ${endIndex} của ${length}`;
//         };
//         var conf = this.config.getConfig();
//         this.query.PageSize = conf.pageSize;
//     }

//     ngOnInit() {
//         this.getData();
//         this.getSearchData();
//         this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
//     }

//     getData() {
//         this.isLoading = true;
//         this.docofrequestService.getByPage(this.params).subscribe((res: any) => {
//             this.list = res.Data.ListObj;
//             this.total = res.Data.Pagination.NumberOfRows;
//             this.isLoading = false;
//             this.cdr.detectChanges();
//         });
//     }

//     getNextPage(e: PageEvent) {
//         this.query.PageIndex = e.pageIndex;
//         this.query.PageSize = e.pageSize;
//         this.getData();
//     }

//     getSearchData() {
//         this.getData();
//     }

//     clearsearch() {
//         this.query.PageIndex = 0;
//         this.query.KeyWord = '';

//         this.query.SortField = '';
//         this.query.SortDirection = 'desc';
//         this.getData();
//     }
//     search() {
//         this.query.PageIndex = 0;
//         this.getData();
//     }

//     changeSort(e: any) {
//         this.query.SortField = e.active;
//         this.query.SortDirection = e.direction;
//         this.search();
//     }
//     rowSelectionChangeLog(value: any) {
//         console.log(value);
//         this.listDocof = value;
//         if (value > 0) {
//             this.disableButton = true;
//         } else {
//             this.disableButton = false;
//         }
//     }

//     setViewId(id) {
//         this.viewId = id;
//     }

//     Delete(value: any) {
//         this.docofrequestService.docofrequestDelete({ Id: value.Id }).subscribe((data: any) => {
//             this.toastr.success(`Đã xoá ${value.DocofrequestName}!`);
//         });
//         this.getData();
//     }

//     Viewdocofrequest(value: any) {
//         this.setViewId(value);
//         const dialogRef = this.dialog.originalOpen(CreateDocofrequestComponent, {
//             width: '1000px',
//             data: { viewId: value.RegistrasionlistId },
//         });
//         dialogRef.disableClose = true;
//         dialogRef.afterClosed().subscribe((result) => {
//             console.log('The dialog was closed');
//             if (result == '1') this.getData();
//         });
//     }
// }
