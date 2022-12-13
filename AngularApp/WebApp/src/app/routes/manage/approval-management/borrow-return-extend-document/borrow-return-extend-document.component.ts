import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ConfigService } from '@core';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';

import { ApprovalManagementService } from '../approval-management.service';
import { AddBorrowerInfor } from './add-borrower-infor';
import { DetailsBorrowSlip } from './details-borrow-slip';
import { ExtendBorrowSlip } from './extend-borrow-slip';
import { ReturnDocument } from './return-document';

@Component({
    selector: 'app-borrow-return-extend-document',
    templateUrl: './borrow-return-extend-document.component.html',
    styleUrls: ['./borrow-return-extend-document.component.scss'],
})
export class BorrowReturnExtendDocumentComponent implements OnInit {
    isLoading = false;
    viewId: number;

    borrowReturnExtendList: any;
    total: number;

    query = {
        Status: null,
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
    };

    borrowReturnExtendColumn: MtxGridColumn[] = [
        { header: 'Số phiếu', field: 'Votes', width: '150px', sortable: true },
        { header: 'Người mượn', field: 'FullName', width: '200px', sortable: true },
        { header: 'Hồ sơ mượn', field: 'Title', width: '200px', sortable: true },
        {
            header: 'Ngày mượn',
            field: 'BorrowDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày gia hạn',
            field: 'ExtendDate',
            width: '150px',
            hide: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '150px',
            tag: {
                4: { text: 'Đã trả một phần', color: 'orange-100' },
                6: { text: 'Đang mượn', color: 'purple-100' },
                7: { text: 'Yêu cầu trả hồ sơ', color: 'red-300' },
                8: { text: 'Yêu cầu gia hạn', color: 'red-300' },
            },
        },
        {
            header: 'Chức Năng',

            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'add_circle_outline',
                    tooltip: 'Nhập thông tin người đến mượn',
                    type: 'icon',
                    click: (record) => this.AddBorrowerInformation(record),
                    iif: (record) => !record.ReceiverName,
                },
                {
                    icon: 'note_add ',
                    tooltip: 'Phê duyệt gia hạn hồ sơ',
                    type: 'icon',
                    click: (record) => this.ExtendDateSlip(record),
                    iif: (record) => (record.Status == 8 ? true : false),
                },
                {
                    icon: 'assignment',
                    tooltip: 'Trả hồ sơ',
                    type: 'icon',
                    click: (record) => this.ReturnDocument(record),
                },
                {
                    icon: 'speaker_notes',
                    tooltip: 'Yêu cầu trả hồ sơ',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Yêu cầu trả hồ sơ',
                    popCloseText: 'Đóng',
                    popOkText: 'Yêu cầu',
                    // popDescription: 'Đưa thông tin hồ sơ vào đây!',
                    click: (record) => this.RequestReturnDocument(record),
                    iif: (record) => (record.Status != 7 ? true : false),
                },
                {
                    icon: 'speaker_notes_off',
                    tooltip: 'Thu hồi yêu cầu trả hồ sơ',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Thu hồi yêu cầu trả hồ sơ',
                    popCloseText: 'Đóng',
                    popOkText: 'Thu hồi',
                    // popDescription: 'Đưa thông tin hồ sơ vào đây!',
                    click: (record) => this.RefuseRequestReturnDocument(record),
                    iif: (record) => (record.Status == 7 ? true : false),
                },
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết phiếu mượn',
                    type: 'icon',
                    click: (record) => this.ViewDetailsBorrowSlip(record),
                },
            ],
        },
    ];

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private cdr: ChangeDetectorRef,
        public datepipe: DatePipe,
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

    ngOnInit(): void {
        this.getSearchData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản ghi:';
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
        // this.listReigstration = value;
        // if (value > 0) {
        //     this.disableButton = true;
        // } else {
        //     this.disableButton = false;
        // }
    }

    getData() {
        this.isLoading = true;
        this.borrowReturnExtendList = new Registrasionlist();
        this.approvalManagementService.getBorrowReturnExtend(this.params).subscribe((res: any) => {
            this.total = res.Data.Pagination.NumberOfRows;
            this.borrowReturnExtendList = res.Data.ListObj;
            this.borrowReturnExtendList.forEach((e: any) => {
                if (e.Status == 8) e.ExtendDate = null;
            });

            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    viewList(value: any) {
        // this.viewId = value.Id;
        // const dialogRef = this.dialog.originalOpen(AcceptBorrowSlip, {
        //     width: '1000px',
        //     data: { viewId: value.Id },
        // });
        // dialogRef.disableClose = true;
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('The dialog was closed');
        //     if (result == '1') this.getData();
        // });
    }

    AddBorrowerInformation(value: any) {
        const dialogRef = this.dialog.originalOpen(AddBorrowerInfor, {
            width: '1200px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    ExtendDateSlip(value: any) {
        const dialogRef = this.dialog.originalOpen(ExtendBorrowSlip, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    ReturnDocument(value: any) {
        const dialogRef = this.dialog.originalOpen(ReturnDocument, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    RequestReturnDocument(value: any) {
        console.log(value);
        this.approvalManagementService.requestReturn({ Id: value.Id }).subscribe(() => {
            this.toastr.success('Yêu cầu trả hồ sơ thành công!');
            this.getData();
        });
    }

    RefuseRequestReturnDocument(value: any) {
        this.approvalManagementService.refuseRequestReturn({ Id: value.Id }).subscribe(() => {
            this.toastr.success('Thu hồi yêu cầu trả hồ sơ thành công!');
            this.getData();
        });
    }

    ViewDetailsBorrowSlip(value: any) {
        const dialogRef = this.dialog.originalOpen(DetailsBorrowSlip, {
            width: '1000px',
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
