import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { FieldsService } from './fields.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Fields } from '../../../models/fields';
import { CreateFieldsComponent } from './fields-form.component';

@Component({
    selector: 'app-fields',
    templateUrl: './fields.component.html',
    styleUrls: ['./fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FieldsService],
})
export class FieldsComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'ID', field: 'Id', width: '100px', hide: true },
        { header: 'Lĩnh vực hồ sơ', field: 'Name', width: '300px', sortable: true },
        { header: 'Mã', field: 'Code', width: '150px', sortable: true },
        { header: 'Thứ/Tự', field: 'SortOrder', width: '150px', sortable: true },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        { header: 'Mô Tả', field: 'Description', width: '350px', sortable: true },
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
                    click: (record) => this.editFields(record),
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
                    click: (record) => this.deleteFields(record),
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
    fields: Fields;
    activeCatalogs: any;
    provinceList: any;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    listcatalog: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private fieldsService: FieldsService,
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
        this.fieldsService.getByPage(this.params).subscribe((res: any) => {
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
    newFields() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateFieldsComponent, {
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
    deleteFields(value: any) {
        this.fieldsService.deleteFields({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.toastr.success(`Đã xoá ${value.Name}!`);
        });
    }

    editFields(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateFieldsComponent, {
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
