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
    selector: 'view-refuse',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './view-refuse.html',
})
export class ViewRefuseComponent {
    fileBaseUrl: any;
    approve: Approve;
    approveList: any;
    list = [];
    record: Record;
    total = 0;
    isLoading = false;
    viewId: any;
    warehouseList: any;
    RecordId: number;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    recordlist: any;
    isButtonDisabled: boolean;
    url: any;
    import: any;
    FileName: any;
    urldownload: any;
    staffList: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private approveService: ApproveService,
        private toastr: ToastrService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        public dialogRef: MatDialogRef<ViewRefuseComponent>,
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
        this.RecordId = data.RecordId;
        this.approve = new Approve();
        this.record = new Record();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.approve = new Approve();
        if (this.viewId != 0) {
            this.approveService.GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.approve = data.Data;
                this.cdr.detectChanges();
            });
        }
        this.getallrecord();
        this.StaffGetByUnit();
    }
    StaffGetByUnit() {
        this.approveService.getStaffGetByUnit({}).subscribe((data: any) => {
            this.staffList = data.Data.Staffs;
        });
    }
    getallrecord() {
        this.record = new Record();
        this.approve = new Approve();
        this.approveService
            .ViewDetailRecordRefuse({ Id: this.viewId, RecordId: this.record.RecordId })
            .subscribe((data: any) => {
                this.recordlist = data.Data.Approves;
                this.record = data.Data.Approves;
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
    setViewId(id) {
        this.viewId = id;
    }
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
    viewrecordDetails(value: any) {
        this.setViewId(value);
        const dialogRef = this.dialog.originalOpen(ViewRecordComponent, {
            width: '650px',
            data: { viewId: value },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
