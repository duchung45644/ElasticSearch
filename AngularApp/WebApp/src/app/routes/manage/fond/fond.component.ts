import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { FondService } from './fond.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Fond } from '../../../models/fond';
import { CreateFondComponent } from './fond-form.component';

@Component({
    selector: 'app-fond',
    templateUrl: './fond.component.html',
    styleUrls: ['./fond.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FondService],
})
export class FondComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Mã', field: 'Id', width: '100px', hide: true },
        { header: 'Tên phông', field: 'FondName', width: '300px', sortable: true },
        { header: 'Mã cơ quan', field: 'DepartmentName', width: '150px', sortable: true },
        { header: 'Số TL giấy', field: 'CoppyNumber', width: '150px', sortable: true },
        { header: 'Công cụ tra cứu', field: 'LookupTools', width: '350px', sortable: true },
        //{ header: 'Chức năng', field: ' ',width: '100px', sortable: true },
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
                    click: (record) => this.editFond(record),
                },
                {
                    icon: 'delete',
                    tooltip: 'Xoá',
                    color: 'warn',
                    type: 'icon',
                    pop: true,
                    popCloseText: 'Đóng',
                    popOkText: 'Đồng ý',
                    popTitle: 'Xác nhận xoá ?',
                    click: (record) => this.deleteFond(record),
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
    position: Fond;
    activeFond: any;
    provinceList: any;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private fondService: FondService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,

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
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    getData() {
        this.isLoading = true;
        this.fondService.getByPage(this.params).subscribe((res: any) => {
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
    newFond() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateFondComponent, {
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
    deleteFond(value: any) {
        this.fondService.deleteFond({ Id: value.Id }).subscribe((data: any) => {
            this.toastr.success(`Đã xoá ${value.FondName}!`);
        });
        this.getData();
    }

    editFond(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateFondComponent, {
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
