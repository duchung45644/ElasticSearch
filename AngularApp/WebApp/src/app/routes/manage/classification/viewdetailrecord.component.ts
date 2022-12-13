import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ShelfService } from '../shelf/shelf.service';
import { PageEvent } from '@angular/material/paginator';

import { Record } from '../../../models/Record';
@Component({
    selector: 'viewdetailrecord',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './viewdetailrecord.html',
})
export class ViewDetailRecordComponent {
    record: Record;
    positionList: any;
    viewId: any;
    RecordId: any;
    constructor(
        private shelfService: ShelfService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<ViewDetailRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.record = new Record();
        this.RecordId = data.viewId;
        this.viewId = data.value;
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.record = new Record();
        if (this.viewId > 0) {
            this.shelfService.Recordgetbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.record = data.Data;
            });
        }
    }
}
