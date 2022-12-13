import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RenewalprofileService } from './renewalprofile.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { CreateRenewalprofileComponent } from './renewalprofile-form.component.';
import { CreateDocumentArchivesViewComponent } from '../list/documentArchivesView-form.component';
@Component({
    selector: 'app-renewalprofile',
    templateUrl: './renewalprofile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RenewalprofileService],
})
export class RenewalprofileComponent implements OnInit {
    @Input() refreshAppGrid: boolean = false;

    html: '';
    columns: MtxGridColumn[] = [
        { header: 'Số phiếu mượn', field: 'Votes', width: '100px', hide: true },
        { header: 'Người mượn', field: 'FullName', width: '200px', sortable: true },
        { header: 'Hồ sơ mượn', field: 'Title', width: '200px', sortable: true },
        {
            header: 'Ngày mượn',
            field: 'BorrowDate',
            width: '200px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '200px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày gia hạn',
            field: 'ExtendDate',
            width: '200px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },

        // {
        //   header: 'Khoá',
        //   field: 'IsLocked',
        //   type: 'tag',
        //   width: '120px',

        //   tag: {S
        //     false: { text: 'Hoạt động', color: 'green-100' },
        //     true: { text: 'Dừng', color: 'red-100' },
        //   },
        //  },

        {
            header: 'Chức Năng',
            field: 'option',
            width: '150px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'note_add ',
                    tooltip: 'Gia hạn hồ sơ',
                    type: 'icon',
                    click: (record) => this.editRenewalprofile(record),
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
    renewalprofile: Registrasionlist;
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
        private renewalprofileService: RenewalprofileService,
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
        this.renewalprofile = new Registrasionlist();
    }

    ngOnInit() {
        // this.editor = new Editor();
        this.getData();
        this.getSearchData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    ngOnChanges() {
        if (this.refreshAppGrid) {
            this.getData();
        }
    }

    getData() {
        this.isLoading = true;
        this.renewalprofileService.getByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }
    FormatList = [
        { FormatId: 1, FormatName: 'Bản gốc' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];

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
    newRenewalprofile() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateRenewalprofileComponent, {
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
    deleteRenewalprofile(value: any) {
        this.renewalprofileService.deleteRenewalprofile({ Id: value.Id }).subscribe((data: any) => {
            this.toastr.success(`Đã xoá ${value.FondName}!`);
        });
        this.getData();
    }

    editRenewalprofile(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateRenewalprofileComponent, {
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
