import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { LogbookborrowedService } from './logbookborrowed.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Docofrequest } from 'app/models/Docofrequest';
import { CreateLogbookborrowedComponent } from './logbookborrowed-form.component';
import { Registrasionlist } from 'app/models/Registrasionlist';

@Component({
    selector: 'app-logbookborrowed',
    templateUrl: './logbookborrowed.component.html',
    styleUrls: ['./logbookborrowed.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LogbookborrowedService],
})
export class LogbookborrowedComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Người mượn', field: 'FullName', width: '150px', sortable: true },
        {
            header: 'Ngày mượn',
            field: 'ReceiveDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        { header: 'Tên hồ sơ mượn', field: 'Title', width: '150px', sortable: true },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày trả',
            field: 'ReimburseDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                0: { text: 'Mới đăng ký', color: 'red-100' },
                1: { text: 'Gửi yêu cầu đăng ký', color: 'orange' },
                2: { text: 'Đã phê duyệt', color: 'red-100' },
                3: { text: 'Đã trả hết', color: 'red-100' },
                4: { text: 'Đã trả một phần', color: 'red-100' },
                5: { text: 'Đã hủy', color: 'red-100' },
                6: { text: 'Đang mượn', color: 'green-100' },
            },
        },
        {
            header: 'Chức Năng',
            field: 'option',
            width: '50px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                // {
                //   icon: 'delete',
                //   tooltip: 'Hủy phiếu mượn',
                //   color: 'warn',
                //   type: 'icon',
                //   pop: true,
                //   popTitle: 'Xác nhận hủy ?',
                //   click: record => this.Delete(record),
                // },
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.Viewdocofrequest(record),
                },
            ],
        },
    ];
    list = [];
    total = 0;
    isLoading = false;
    viewId: number;

    message: string;
    apiBaseUrl: String;
    showSearch = false;
    docofrequest: Docofrequest;
    activeLogbookborrowed: any;
    provinceList: any;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        DateAddStart: '',
        DateAddEnd: '',
        logbookborrowedForm: null,
        ReceiveDate: null,
        Title: null,
        ReceiverName: null,
        AppointmentDate: null,
        ReimburseDate: null,
        Status: null,
    };
    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private logbookborrowedService: LogbookborrowedService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        public datepipe: DatePipe,
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
        this.docofrequest = new Docofrequest();
        this.apiBaseUrl = conf.apiBaseUrl;
    }
    StatisticalReportAssets() {
        if (this.query.logbookborrowedForm == null || this.query.logbookborrowedForm == undefined) {
            this.query.logbookborrowedForm = 0;
        }
        if (this.query.ReceiveDate == null || this.query.ReceiveDate == undefined) {
            this.query.ReceiveDate = 0;
        }
        if (this.query.Title == null || this.query.Title == undefined) {
            this.query.Title = 0;
        }
        if (this.query.ReceiverName == null || this.query.ReceiverName == undefined) {
            this.query.ReceiverName = 0;
        }
        if (this.query.AppointmentDate == null || this.query.AppointmentDate == undefined) {
            this.query.AppointmentDate = 0;
        }
        if (this.query.ReimburseDate == null || this.query.ReimburseDate == undefined) {
            this.query.ReimburseDate = 0;
        }
        if (this.query.Status == null || this.query.Status == undefined) {
            this.query.Status = 0;
        }
        var start = this.datepipe.transform(this.query.DateAddStart, 'yyyy-MM-dd');
        var end = this.datepipe.transform(this.query.DateAddEnd, 'yyyy-MM-dd');
        if (start == '' || start == null) {
            start = '1990-01-01';
        }
        if (end == '' || end == null) {
            end = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');
        }
        window.open(
            `${this.apiBaseUrl}report/DownloadExcelStatisAccessmonitor?logbookborrowedForm=${this.query.logbookborrowedForm}&ReceiveDate=${this.query.ReceiveDate}&Title=${this.query.Title}&ReceiverName=${this.query.ReceiverName}&AppointmentDate=${this.query.AppointmentDate}&ReimburseDate=${this.query.ReimburseDate}&Status=${this.query.Status}&start=${start}&end=${end}`,
        );
    }
    ngOnInit() {
        this.getData();
        this.getSearchData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }
    getData() {
        this.isLoading = true;
        this.logbookborrowedService.getByPage(this.params).subscribe((res: any) => {
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
    }

    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        // this.search();
    }
    rowSelectionChangeLog(e: any) {
        console.log(e);
    }
    newLogbookborrowed() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateLogbookborrowedComponent, {
            width: '800px',
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
    getNodeErrorDateTimeStart($ErrorDateTimeStart) {
        var ErrorDateTimeStarte = this.datepipe.transform($ErrorDateTimeStart, 'yyyy-MM-dd HH:mm:ss');
        this.query.DateAddStart = ErrorDateTimeStarte;
        this.getData();
        this.cdr.detectChanges();
    }
    getNodeErrorDateTimeEnd($ErrorDateTimeEnd) {
        var ErrorDateTimeEnde = this.datepipe.transform($ErrorDateTimeEnd, 'yyyy-MM-dd HH:mm:ss');
        this.query.DateAddEnd = ErrorDateTimeEnde;
        this.getData();
        this.cdr.detectChanges();
    }
    Viewdocofrequest(value: any) {
        this.setViewId(value);
        const dialogRef = this.dialog.originalOpen(CreateLogbookborrowedComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
