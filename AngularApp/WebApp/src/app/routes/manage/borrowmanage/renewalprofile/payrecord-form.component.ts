import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RenewalprofileService } from './renewalprofile.service';
import { PageEvent } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
//import { CreateDocumentArchivesViewComponent } from './ArchivesView-form.component';
import { CreateDocumentArchivesViewComponent } from '../list/documentArchivesView-form.component';
import { User } from '@core';
@Component({
    selector: 'dialog-payrecord-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-payrecord-form.html',
})
export class CreatePayrecordComponent {
    payrecord: Registrasionlist;
    user: User;
    UserList: any;
    viewId: any;
    InforList: any;
    fileList: any;
    apiUrl: string;
    conditionList: any;
    constructor(
        public datepipe: DatePipe,
        private renewalprofileService: RenewalprofileService,
        public dialog: MtxDialog,
        private toastr: ToastrService,

        public dialogRef: MatDialogRef<CreatePayrecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.payrecord = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
        this.payrecord.ReimburseStatus = this.user.Id;
        this.payrecord.RegisterUser = this.user.Id;
    }
    getDataListPayRecord() {
        this.renewalprofileService.getbyidListPayRecord({ Id: this.viewId }).subscribe((data: any) => {
            this.InforList = data.Data;
        });
    }
    FormatList = [
        { FormatId: 1, FormatName: 'Bản giấy' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Bản sao' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];
    getData() {
        this.payrecord = new Registrasionlist();
        if (this.viewId > 0) {
            this.renewalprofileService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.payrecord = data.Data;
                this.InforList = data.Data.DocRequests;
            });
        }
        this.GetAllstaff();
        this.getallcondition();
    }
    onSubmit(dataPayrecord) {
        var listcheck = [];
        for (var i = 0; i < this.InforList.length; i++) {
            var assets = this.InforList[i];
            if (assets.Selected) {
                listcheck.push(assets);
            }
        }
        var data = {
            Id: this.payrecord.Id,
            Votes: this.payrecord.Votes,
            RegisterUser: this.payrecord.RegisterUser,
            RecordId: this.payrecord.RecordId,
            BorrowDate: this.payrecord.BorrowDate,
            AppointmentDate: this.payrecord.AppointmentDate,
            ReimburseStaffId: this.payrecord.ReimburseStaffId,
            ReimburseStatus: this.payrecord.ReimburseStatus,
            RecipientsName: this.payrecord.RecipientsName,
            ReimburseNote: this.payrecord.ReimburseNote,
            ReimburseName: this.payrecord.ReimburseName,

            DocRequests: listcheck,
        };
        this.renewalprofileService.savepayrecord(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }
    GetAllstaff() {
        this.renewalprofileService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }

    getrecordbyunit($event) {
        this.renewalprofileService.getrecordbyunit({ id: $event }).subscribe((data: any) => {
            this.fileList = data.Data;
        });
    }
    getInfoByRegistrasionlist($event) {
        if (this.payrecord.RecordId > 0 && (this.viewId == null || this.viewId == 0)) {
            this.renewalprofileService.getbyBorrowRequestId({ id: $event }).subscribe((data: any) => {
                this.InforList = data.Data;
            });
        }
    }
    getallcondition() {
        this.renewalprofileService.getallcondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }
    setViewId(id) {
        this.viewId = id;
    }
    ArchiveView(value: any) {
        this.setViewId(value.DocumentArchiveId);
        const dialogRef = this.dialog.originalOpen(CreateDocumentArchivesViewComponent, {
            width: '800px',
            data: { viewId: value.DocumentArchiveId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
}
