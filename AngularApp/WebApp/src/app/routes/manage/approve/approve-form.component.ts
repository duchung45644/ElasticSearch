import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ApproveService } from './approve.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Approve } from '../../../models/approve';
import { Record } from 'app/models/Record';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@core';
import { ViewRecordComponent } from './view-record.component';
@Component({
    selector: 'dialog-approve-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-approve-form.html',
})
export class CreateApproveComponent {
    columns: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã Hồ Sơ', field: 'FileCode', width: '100px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Tổng số tờ', field: 'TotalPaper', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'Maintenance', sortable: true },
        { header: 'Tên kho', field: 'WareHouseName', sortable: true },
        {
            header: 'Đợt tiêu hủy',
            field: 'CancelTime',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '100px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewrecord(record),
                },
            ],
        },
    ];
    fileBaseUrl: any;
    approve: Approve;
    approveList: any;
    list = [];
    record: Record;
    hidden: boolean = true;
    recordlistssss: any;
    total = 0;
    isLoading = false;
    viewId: any;
    warehouseList: any;

    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    recordlist: any;

    isButtonDisabled: boolean = true;
    url: any;
    import: any;
    FileName: any;
    urldownload: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private approveService: ApproveService,
        private toastr: ToastrService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        public dialogRef: MatDialogRef<CreateApproveComponent>,
        public datePipe: DatePipe,
        public dialog: MtxDialog,
        private cdr: ChangeDetectorRef,
        private config: ConfigService,
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
        this.fileBaseUrl = conf.fileBaseUrl;
        this.import = {
            Url: 'upload/UploadFile',
        };
        this.viewId = data.viewId;
        this.approve = new Approve();
    }

    ngOnInit() {
        this.getData();
        this.getall();
        this.getdatabypage();
    }

    getData() {
        this.approve = new Approve();
        if (this.viewId != 0) {
            this.approveService.GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.approve = data.Data;
                this.cdr.detectChanges();
            });
            if ((this.recordlist = [])) {
                this.isButtonDisabled = true;
            }
        }
        this.getall();
    }

    getall() {
        this.approveService.getallwarehouse({}).subscribe((data: any) => {
            this.warehouseList = data.Data.Warehouses;
        });
    }
    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getdatabypage();
    }

    clearsearch() {
        this.query.PageIndex = 0;
        this.query.KeyWord = '';
        this.query.SortDirection = 'desc';
        this.getdatabypage();
    }
    search() {
        this.query.PageIndex = 0;
        this.getdatabypage();
    }
    updateAllComplete(event) {
        if (event == true) {
            this.hidden = false;
        } else {
            this.hidden = true;
        }
    }
    rowSelectionChangeLog(e: any) {
        this.recordlist = e;
        if (e.length > 0) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }
    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }

    onSubmit(dataApprove) {
        var listRecordCheck = [];
        for (var i = 0; i < this.recordlist.length; i++) {
            var recordlists = this.recordlist[i].Id;
            listRecordCheck.push(recordlists);
        }
        var data = {
            Id: this.approve.Id,
            Code: this.approve.Code,
            Description: this.approve.Description,
            Ctime: this.datePipe.transform(this.approve.Ctime),
            Name: this.approve.Name,
            ListAttachment: this.approve.ListAttachment,
            ListRecord: listRecordCheck,
        };

        this.approveService.SaveApprove(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }
    View = (att) => {
        this.url = this.fileBaseUrl + att.FilePath;
    };
    getdatabypage() {
        this.isLoading = true;
        this.approveService.getByPagerecord(this.params).subscribe((res: any) => {
            this.recordlist = res.Data;
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }
    // addAction() {
    //   var action = new Action();
    //   if (this.right.ListAction == undefined) this.right.ListAction = [];
    //   this.right.ListAction.push(action);
    // }
    removeAttachmentofApprove = (att) => {
        const index: number = this.approve.ListAttachment.indexOf(att);
        if (index !== -1) {
            this.approve.ListAttachment.splice(index, 1);
        }
    };

    public uploadFinished = (event) => {
        if (event.Success) {
            if (this.approve.ListAttachment == undefined) {
                this.approve.ListAttachment = [];
            }
            this.approve.ListAttachment.push({
                FileName: event.Name,
                FilePath: event.Url,
            });
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };

    setViewId(id) {
        this.viewId = id;
    }
    viewrecord(value: any) {
        debugger;
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(ViewRecordComponent, {
            width: '700px',

            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
