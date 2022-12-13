import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { AccessmonitorService } from './accessmonitor.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Accessmonitor } from 'app/models/Accsessmonitor';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-accessmonitor',
    templateUrl: './accessmonitor.component.html',
    styleUrls: ['./accessmonitor.component.scss'],
})
export class AccessmonitorComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'STT', field: 'Id', width: '100px', sortable: true },
        { header: 'Chức năng', field: 'Object', width: '200px', sortable: true },
        { header: 'Thao tác', field: 'Description', width: '250px', sortable: true },
        { header: 'Người dùng', field: 'FullName', width: '250px', sortable: true },
        {
            header: 'Ngày',
            field: 'AccessDate',
            width: '350px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy hh:mm:ss' },
        },
        // {
        //   header: 'Khoá',
        //   field: 'IsLocked',
        //   type: 'tag',
        //   width: '120px',

        // //   tag: {S
        // //     false: { text: 'Hoạt động', color: 'green-100' },
        // //     true: { text: 'Dừng', color: 'red-100' },
        // //   },
        //  },
    ];
    list = [];
    total = 0;
    isLoading = false;

    viewIdId: number;

    message: string;

    showSearch = false;
    // accessmonitor: Accessmonitor;
    accessmonitor: Accessmonitor = new Accessmonitor();
    activeFormresults: any;
    provinceList: any;
    query = {
        AssetsPriceStart: null,
        AssetsPriceEnd: null,
        Object: null,
        Description: null,
        UserId: null,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        DateAddStart: '',
        DateAddEnd: '',
    };
    Id: any;
    apiBaseUrl: string;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        public accessmonitorService: AccessmonitorService,
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
        this.apiBaseUrl = conf.apiBaseUrl;
    }

    ngOnInit() {
        this.getData();
        this.getSearchData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    getData() {
        this.isLoading = true;
        this.accessmonitorService.getByPage(this.params).subscribe((res: any) => {
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

    getNodeErrorDateTimeStart($ErrorDateTimeStart) {
        debugger;
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

    StatisticalReportAssets() {
        var start = this.datepipe.transform(this.query.DateAddStart, 'yyyy-MM-dd');
        var end = this.datepipe.transform(this.query.DateAddEnd, 'yyyy-MM-dd');
        //  if (this.query.UnitId == null || this.query.UnitId == undefined) { this.query.UnitId = 0 }
        if (this.query.Object == null || this.query.Object == undefined) {
            this.query.Object = 0;
        }
        if (this.query.Description == null || this.query.Description == undefined) {
            this.query.Description = 0;
        }
        // if (this.query.AssetsPriceStart == null || this.query.AssetsPriceStart == undefined) { this.query.AssetsPriceStart = 0 }
        // if (this.query.AssetsPriceEnd == null || this.query.AssetsPriceEnd == undefined) { this.query.AssetsPriceEnd = 0 }
        if (this.query.UserId == null || this.query.UserId == undefined) {
            this.query.UserId = 0;
        }
        if (start == '' || start == null) {
            start = '1990-01-01';
        }
        if (end == '' || end == null) {
            end = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');
        }
        window.open(
            `${this.apiBaseUrl}report/DownloadExcelStatisticalReportAssets?start=${start}&end=${end}&I=${this.query.Object}&SI=${this.query.UserId}&C=${this.query.Description}`,
        );
    }

    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }
    rowSelectionChangeLog(e: any) {
        console.log(e);
    }
}
