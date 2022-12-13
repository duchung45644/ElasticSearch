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
import { RecordService } from '../record/record.service';

@Component({
    selector: 'view-record',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './view-record.html',
})
export class ViewRecordComponent {
    fileBaseUrl: any;
    approve: Approve;
    approveList: any;
    list = [];
    record: Record;
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
    isButtonDisabled: boolean;
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
        private recordService: RecordService,
        private toastr: ToastrService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        public dialogRef: MatDialogRef<ViewRecordComponent>,
        public datePipe: DatePipe,
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
    }

    getData() {
        debugger;
        this.record = new Record();
        this.approve = new Approve();
        if (this.viewId != 0) {
            this.recordService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.record = data.Data;
                this.cdr.detectChanges();
            });
        }
    }

    // addAction() {
    //   var action = new Action();
    //   if (this.right.ListAction == undefined) this.right.ListAction = [];
    //   this.right.ListAction.push(action);
    // }
}
