import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Approve } from 'app/models/approve';
import { ToastrService } from 'ngx-toastr';
import { ApproveService } from './approve.service';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Record } from 'app/models/Record';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';
@Component({
    selector: 'refuse-form',
    templateUrl: './refuse-form.component.html',
})
export class CreateRefuseComponent {
    approve: Approve;
    record: Record;
    viewId: any;
    recordlist: any;
    staffList: null;
    constructor(
        private approveService: ApproveService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateRefuseComponent>,
        public dialogo: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.approve = new Approve();
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        debugger;
        this.approve = new Approve();
        if (this.viewId > 0) {
            this.approveService.GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.approve = data.Data;
                this.approve.StaffIdRefuse = null;
            });
        }
        this.getallrecord();
        this.StaffGetByUnit();
    }
    getallrecord() {
        this.record = new Record();
        this.approve = new Approve();
        this.approveService.GetAllRecord({ Id: this.viewId }).subscribe((data: any) => {
            this.recordlist = data.Data.Approves;
        });
    }
    StaffGetByUnit() {
        this.approveService.getStaffGetByUnit({}).subscribe((data: any) => {
            this.staffList = data.Data.Staffs;
        });
    }
    onSubmit(dataApprove): void {
        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn từ chối đợt hủy?`,
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
                        Id: this.approve.Id,
                        Code: this.approve.Code,
                        Description: this.approve.Description,

                        Name: this.approve.Name,
                        Reason: this.approve.Reason,
                        StaffId: this.approve.StaffId,
                        StaffIdRefuse: this.approve.StaffIdRefuse,
                    };
                    this.approveService.UpdateApprove(data).subscribe((data: any) => {
                        this.toastr.success(`Đã từ chối!`);

                        this.dialogRef.close(1);
                        this.getData();
                        // location.reload();
                        location.replace('manage/approve');
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }
}
