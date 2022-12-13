//import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,EventEmitter, Output } from '@angular/core';
import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CreateViewListComponent } from './view-list-form.component';
import { ListService } from './list.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { CreateAddinformationComponent } from './addinformation-form.component';
import { CreateShowAllComponent } from './showAll-form.component';
import { CreateDocumentArchivesViewComponent } from './documentArchivesView-form.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListService],
})
export class ListComponent implements OnInit {
    @Input() refreshGrid: boolean = false;
    @Output() refreshAppList = new EventEmitter();
    hiddenButton: boolean = true;

    columns: MtxGridColumn[] = [
        { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
        { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true },
        { header: 'Hồ sơ mượn', field: 'Title', width: '120px', sortable: true },
  {
            header: 'Ngày mượn',
            field: 'BorrowDate',
            width: '120px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '120px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Chức Năng',
            field: 'option',
            width: '50px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'dashboard',
                    tooltip: 'Xác nhận phiếu mượn',
                    type: 'icon',
                    click: (record) => this.viewList(record),
                },
                {
                    icon: 'add_circle_outline',
                    tooltip: 'Thông tin người đến mượn',
                    type: 'icon',
                    click: (record) => this.AddList(record),
                },
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết phiếu mượn',
                    type: 'icon',
                    click: (record) => this.ViewAll(record),
                },
            ],
        },    ];

    list = [];
    total = 0;
    isLoading = false;
    viewId: number;
    message: string;
    sub!: Subscription;
    showSearch = false;
    List: Registrasionlist;
    activeRegistrasionlist: any;
    provinceList: any;
    fondList: any;
    fileList: any;
    listReigstration: any;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    listarray: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private listService: ListService,
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

    ngOnChanges() {
        if (this.refreshGrid) {
            this.getData();
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getData() {
        this.isLoading = true;
        this.sub = this.listService.getByPage(this.params).subscribe((res: any) => {
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
    rowSelectionChangeLog(value: any) {
        console.log(value);
        this.listReigstration = value;
    }

    setViewId(id) {
        this.viewId = id;
    }

    viewList(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateViewListComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
            this.refreshAppList.emit('refresh');
        });
    }

    AddList(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateAddinformationComponent, {
            width: '1200px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    ViewAll(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateShowAllComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    DocumentView(value: any) {
        this.setViewId(value);
        const dialogRef = this.dialog.originalOpen(CreateDocumentArchivesViewComponent, {
            width: '1200px',
            data: { viewId: value },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
