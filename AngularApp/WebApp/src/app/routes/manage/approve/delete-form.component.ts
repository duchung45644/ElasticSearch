import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { DatePipe } from '@angular/common';

import { PageEvent } from '@angular/material/paginator';
import { ApproveService } from './approve.service';
import { RecordService } from '../record/record.service';
import { Approve } from 'app/models/approve';
import { Record } from 'app/models/Record';
import { ConfigService } from '@core';
import { CreateRefuseComponent } from './refuse-form.component';
import { ViewRecordComponent } from './view-record.component';

@Component({
    selector: 'dialog-delete-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-delete-form.html',
})
export class CreateDeleteRecordsComponent {
    approve: Approve;
    record: Record;
    staffList: any;
    viewId: any;
    RecordId: number;
    fileBaseUrl: any;
    url: any;
    import: any;
    FileName: any;
    urldownload: any;
    recordlist: Record[];
    constructor(
        private approveService: ApproveService,
        private recordService: RecordService,
        private toastr: ToastrService,
        private config: ConfigService,
        public datePipe: DatePipe,
        public dialog: MtxDialog,
        public dialogo: MatDialog,
        public dialogRef: MatDialogRef<CreateDeleteRecordsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
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
        this.record = new Record();
        if (this.viewId > 0) {
            this.approveService.GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.approve = data.Data;
                this.approve.StaffId = null;
            });
        }
        this.getallrecord();
        this.StaffGetByUnit();
    }

    getallrecord() {
        this.record = new Record();
        this.approve = new Approve();
        this.approveService
            .GetAllRecordStatus({ Id: this.viewId, RecordId: this.record.RecordId, Status: 3 })
            .subscribe((data: any) => {
                this.recordlist = data.Data.Approves;
                this.record = data.Data.Approves;
            });
    }

    // onSubmit(dataApprove) {

    //   var data = {

    //     Id:this.approve.Id,
    //     Code: this.approve.Code,
    //     Description: this.approve.Description,
    //     Ctime: this.datePipe.transform(this.approve.Ctime),
    //     Name: this.approve.Name,
    //     // CreatedDate: this.datePipe.transform(this.approve.CreatedDate),
    //     ListAttachment:this.approve.ListAttachment
    //   };

    //   this.approveService.SaveApprove(data).subscribe((data: any) => {
    //     this.toastr.success(`Thành công`);

    //   });

    // }
    setViewId(id) {
        this.viewId = id;
    }

    Refuse(value: any) {
        const dialogRef = this.dialog.originalOpen(CreateRefuseComponent, {
            width: '800px',
            data: { viewId: this.viewId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
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
    removeAttachmentofDeleteApprove = (att) => {
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

    StaffGetByUnit() {
        this.approveService.getStaffGetByUnit({}).subscribe((data: any) => {
            this.staffList = data.Data.Staffs;
        });
    }
    // ds(dataApprove) {
    //     this.dialog.confirm('Bạn có muốn phê duyệt đợt hủy này?', () => {
    //         var listRecordCheck = [];
    //         for (var i = 0; i < this.recordlist.length; i++) {
    //             var recordlists = this.recordlist[i].Id;
    //             listRecordCheck.push(recordlists);
    //         }

    //         var data = {
    //             ListRecord: listRecordCheck,
    //             // ApproveId : this.approve.ApproveId,
    //             Id: this.approve.Id,
    //             Code: this.approve.Code,
    //             Ctime: this.approve.Ctime,
    //             Description: this.approve.Description,

    //             Name: this.approve.Name,
    //             StaffId: this.approve.StaffId,
    //         };
    //         this.approveService.CancelRecordApprove(data).subscribe((data: any) => {
    //             this.toastr.success(`Đã phê duyệt thành công!`);
    //             this.dialogRef.close(1);
    //             this.getData();
    //         });
    //     });
    // }
    CancelApprove(dataApprove): void {
        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn phê duyệt đợt hủy?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listRecordCheck = [];
                    for (var i = 0; i < this.recordlist.length; i++) {
                        var recordlists = this.recordlist[i].Id;
                        listRecordCheck.push(recordlists);
                    }

                    var data = {
                        ListRecord: listRecordCheck,
                        // ApproveId : this.approve.ApproveId,
                        Id: this.approve.Id,
                        Code: this.approve.Code,
                        Ctime: this.approve.Ctime,
                        Description: this.approve.Description,

                        Name: this.approve.Name,
                        StaffId: this.approve.StaffId,
                    };
                    this.approveService.CancelRecordApprove(data).subscribe((data: any) => {
                        this.toastr.success(`Đã phê duyệt thành công!`);
                        this.dialogRef.close(1);
                        this.getData();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }
}
