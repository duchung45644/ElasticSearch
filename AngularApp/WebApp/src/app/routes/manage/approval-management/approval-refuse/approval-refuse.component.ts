import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ConfigService } from '@core';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { ToastrService } from 'ngx-toastr';
import { ApprovalManagementService } from '../approval-management.service';
import { AcceptBorrowSlip } from './accept-borrow-slip';

@Component({
    selector: 'app-approval-refuse',
    templateUrl: './approval-refuse.component.html',
    styleUrls: ['./approval-refuse.component.scss'],
})
export class ApprovalRefuseComponent implements OnInit {
    isLoading = false;
    viewId: number;

    borrowSlipList: any;
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

    BorrowSlipListColumns: MtxGridColumn[] = [
        { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
        { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true },
        { header: 'Hồ sơ mượn', field: 'Title', width: '120px', sortable: true },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '120px',
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
                0: { text: 'Mới đăng ký', color: 'pink-300' },
                1: { text: 'Gửi yêu cầu đăng ký', color: 'yellow-100' },
                2: { text: 'Chờ phê duyệt' },
                3: { text: 'Đã trả hết', color: 'blue-100' },
                4: { text: 'Đã trả một phần', color: 'orange-100' },
                5: { text: 'Đã hủy', color: 'red-100' },
                6: { text: 'Đang mượn', color: 'purple-100' },
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
                {
                    icon: 'done',
                    tooltip: 'Phê duyệt và Từ chối',
                    type: 'icon',
                    click: (record) => this.viewList(record),
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

    rowSelectionChangeLog(value: any) {}

    getData() {
        this.isLoading = true;
        this.approvalManagementService.getPageData(this.params).subscribe((res: any) => {
            this.total = res.Data.Pagination.NumberOfRows;
            this.borrowSlipList = res.Data.ListObj;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    viewList(value: any) {
        this.viewId = value.Id;
        console.log(value.Id);

        const dialogRef = this.dialog.originalOpen(AcceptBorrowSlip, {
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
