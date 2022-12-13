import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { PositionService } from './position.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Position } from '../../../models/position';
import { CreatePositionComponent } from './position-form.component';

@Component({
    selector: 'app-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PositionService],
})
export class PositionComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Mã', field: 'Id', width: '100px', hide: true },
        { header: 'Tên', field: 'Name', width: '300px', sortable: true },
        { header: 'Mã', field: 'Code', width: '150px', sortable: true },
        { header: 'Thứ/Tự', field: 'SortOrder', width: '150px', sortable: true },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        { header: 'Mô Tả', field: 'Description', width: '350px', sortable: true },
        // {
        // ield: 'IsLocked',
        //   type: 'tag',
        //   width: '1  header: 'Khoá',
        //   f20px',

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
                    click: (record) => this.editPosition(record),
                },
                {
                    icon: 'delete',
                    tooltip: 'Xoá',
                    color: 'warn',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận xoá ?',
                    click: (record) => this.deletePosition(record),
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
    position: Position;
    activePositions: any;
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
        private positionService: PositionService,
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
        this.positionService.getByPage(this.params).subscribe((res: any) => {
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
    newPosition() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreatePositionComponent, {
            width: '800px',
            data: { viewId: 0 },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    setViewId(id) {
        this.viewId = id;
    }
    deletePosition(value: any) {
        this.positionService.deletePosition({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.toastr.success(`Đã xoá ${value.PositionName}!`);
        });
    }

    editPosition(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreatePositionComponent, {
            width: '800px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
