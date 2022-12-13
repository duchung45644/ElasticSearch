import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../shelf/shelf.service';

import { Record } from '../../../models/Record';
import { Shelf } from 'app/models/Shelf';
import { ConfigService } from '@core/bootstrap/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateDocumentArchiveComponent } from '../documentarchive/documentarchive-form.component';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Box } from 'app/models/Box';
import { ViewDetailRecordComponent } from './viewdetailrecord.component';

@Component({
    selector: 'viewlistrecord',
    templateUrl: './viewlistrecord.html',

    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ShelfService],
})
export class ViewListRecordComponent {
    columns: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã HS', field: 'FileCode', width: '150px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', width: '50px', field: 'MaintenanceName', sortable: true },
        { header: 'Chế độ sử dụng', field: 'RightName', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            tag: {
                0: { text: 'Đang lưu trữ', color: 'green-100' },
                1: { text: 'Hình thành', color: 'blue-100' },
                2: { text: 'Chờ tiêu hủy', color: 'pink-100' },
                3: { text: 'Đang trong đợt hủy', color: 'orange-100' },
                4: { text: 'Đã tiêu hủy', color: 'red-300' },
                5: { text: 'Báo mất', color: 'pink-300' },
            },
        },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết hồ sơ',
                    type: 'icon',
                    click: (record) => this.viewRecord(record),
                },
            ],
        },
    ];

    isLoading = false;
    viewId: number;
    RecordId: number;
    query = {
        BoxId: 0,
        RecordId: 0,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    disable: boolean = true;
    record: Record;
    shelf: Shelf;
    box: Box;
    shelfList: any;
    BoxList: any;
    warehouseList: any;
    list: any;
    total: any;
    documentArchiveList: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private shelfService: ShelfService,
        public dialog: MtxDialog,
        private config: ConfigService,
        private cdr: ChangeDetectorRef,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
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
        this.viewId = data.viewId;
        this.RecordId = data.RecordId;
        this.record = new Record();
        this.shelf = new Shelf();
    }

    ngOnInit() {
        this.getData();
        this.getSearchData();
    }

    getData() {
        this.record = new Record();
        this.box = new Box();
        this.query.BoxId = this.viewId;
        this.query.RecordId = this.RecordId;
        this.shelfService.GetByPageRecord(this.params).subscribe((data: any) => {
            this.box = data.Data;
            this.record = data.Record;
            this.list = data.ListRecord.ListObj;
            this.total = data.ListRecord.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getData();
    }

    clearsearch() {
        this.query.PageIndex = 0;
        this.query.KeyWord = '';
        this.query.SortField = '';
        this.query.SortDirection = 'desc';
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

    viewRecord(value: any) {
        debugger;
        const dialogRef = this.dialog.originalOpen(ViewDetailRecordComponent, {
            width: '650px',
            data: { viewId: this.viewId, value: value.Id, RecordId: this.RecordId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    getSearchData() {
        this.getData();
        // this.getAllCategory();
    }

    search() {
        this.query.PageIndex = 0;
        this.getData();
    }
}
