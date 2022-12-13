import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ApproveService } from './approve.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Approve } from 'app/models/approve';
import { Record } from 'app/models/Record';
import { CreateApproveComponent } from './approve-form.component';
import { CreateDeleteRecordsComponent } from './delete-form.component';
import { ViewApproveComponent } from './view-canceledapprove.component';
import { ViewRefuseComponent } from './view-refuse.component';
import { ViewDocumentArchiveComponent } from '../documentarchive/view-documentarchive.component';
import { ApproveEditComponent } from './approveedit.component';

@Component({
    selector: 'app-approve',
    templateUrl: './approve.component.html',
    styleUrls: ['./approve.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ApproveService],
})
export class ApproveComponent implements OnInit {
    columnsstatus0: MtxGridColumn[] = [
        { header: 'Id', field: 'Id', width: '100px', hide: true },
        { header: 'Mã', field: 'Code', width: '100px', sortable: true },
        { header: 'Tên đợt hủy', field: 'Name', width: '100px', sortable: true },
        { header: 'Người tạo', field: 'FullName', width: '100px', sortable: true },

        {
            header: ' Thời Gian',
            field: 'Ctime',
            width: '100px',
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
            sortable: true,
        },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        { header: 'Mô Tả', field: 'Description', width: '200px', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                0: { text: 'Chờ phê duyệt' },
                1: { text: 'Đã phê duyệt', color: 'green-100' },
                2: { text: 'Đã từ chối', color: 'red-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '200px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',

                    click: (record) => this.editApprove(record),
                },

                {
                    icon: 'done',
                    tooltip: 'Phê duyệt và Từ chối',
                    type: 'icon',

                    click: (record) => this.DeleteApproveRecord(record),
                },

                {
                    icon: 'delete',
                    tooltip: 'Xoá',

                    color: 'warn',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận xoá ?',
                    popCloseText: 'Đóng',
                    popOkText: 'Đồng ý',
                    click: (record) => this.deleteApprove(record),
                },
            ],
        },
    ];
    columnsstatus1: MtxGridColumn[] = [
        { header: 'Id', field: 'Id', width: '100px', hide: true },
        { header: 'Mã', field: 'Code', width: '100px', sortable: true },
        { header: 'Tên đợt hủy', field: 'Name', width: '100px', sortable: true },
        { header: 'Người tạo', field: 'FullName', width: '100px', sortable: true },

        {
            header: ' Thời Gian',
            field: 'Ctime',
            width: '100px',
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
            sortable: true,
        },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        { header: 'Mô Tả', field: 'Description', width: '200px', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                0: { text: 'Chờ phê duyệt' },
                1: { text: 'Đã phê duyệt', color: 'green-100' },
                2: { text: 'Đã từ chối', color: 'red-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '200px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewApprove(record),
                },
            ],
        },
    ];
    columnsstatus2: MtxGridColumn[] = [
        { header: 'Id', field: 'Id', width: '100px', hide: true },
        { header: 'Mã', field: 'Code', width: '100px', sortable: true },
        { header: 'Tên đợt hủy', field: 'Name', width: '100px', sortable: true },
        { header: 'Người tạo', field: 'FullName', width: '100px', sortable: true },

        {
            header: ' Thời Gian',
            field: 'Ctime',
            width: '100px',
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
            sortable: true,
        },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        { header: 'Mô Tả', field: 'Description', width: '200px', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                0: { text: 'Chờ phê duyệt' },
                1: { text: 'Đã phê duyệt', color: 'green-100' },
                2: { text: 'Đã từ chối', color: 'red-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '200px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewrefuse(record),
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
    record: Record;
    approve: Approve;

    query = {
        Status: null,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    warehouseList: any;
    recordlist: any;
    isButtonDisabled: boolean;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private approveService: ApproveService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
    ) {
        this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
                return `0 của ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} của ${length}`;
        };
        var conf = this.config.getConfig();
        this.query.PageSize = conf.pageSize;
    }

    ngOnInit() {
        this.getData();
        this.getSearchData();
        this.getall();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }
    getall() {
        this.approveService.getallwarehouse({}).subscribe((data: any) => {
            this.warehouseList = data.Data.Approve;
        });
    }
    getData() {
        this.isLoading = true;
        this.approveService.getByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
        this.getallrecord();
        if ((this.recordlist = [])) {
            this.isButtonDisabled = true;
        }
    }

    tabChanged($event) {
        var status = 0;
        if ($event.tab.textLabel == 'Danh sách đợt chờ phê duyệt ') {
            status = 0;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách đợt đã phê duyệt') {
            status = 1;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách đợt đã từ chối') {
            status = 2;
            this.query.KeyWord = '';
        }

        this.query.Status = status;
        this.getData();
    }
    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getData();
    }
    viewApprove(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(ViewApproveComponent, {
            width: '1000px',
            height: '450px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    viewrefuse(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(ViewRefuseComponent, {
            width: '1000',
            // height:'500px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    getSearchData() {
        this.getData();
    }
    getallrecord() {
        this.record = new Record();
        this.approve = new Approve();
        this.approveService.GetAllRecord({ Id: this.viewId }).subscribe((data: any) => {
            this.recordlist = data.Data.Approves;
        });
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
        this.recordlist = e;
        if (e.length > 0) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }
    newApprove() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateApproveComponent, {
            width: '1200px',
            height: '750px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    setViewId(id) {
        this.viewId = id;
    }
    deleteApprove(value: any) {
        this.approveService.DeleteApprove({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.toastr.success(`Đã xoá ${value.Code}!`);
        });
    }
    DeleteApproveRecord(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateDeleteRecordsComponent, {
            width: '1200px',
            height: '750px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    editApprove(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(ApproveEditComponent, {
            width: '1200px',
            height: '750px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    editDocumentArchive(value: any) {
        const dialogRef = this.dialog.originalOpen(ViewDocumentArchiveComponent, {
            width: '2000px',
            data: { viewId: this.viewId, value: value.DocumentArchiveId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
