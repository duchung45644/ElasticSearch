import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions';
import { Docofrequest } from 'app/models/Docofrequest';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DetailsDocument } from '../../documentarchive/details-document';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';
import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'return-document',
    templateUrl: './return-document.html',
    styleUrls: ['./borrow-return-extend-document.component.scss'],
})
export class ReturnDocument {
    viewId: any;
    borrowDetails: any;
    documentList: any;
    UserList: any;
    conditionList: any;

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public datepipe: DatePipe,
        public dialogRef: MatDialogRef<ReturnDocument>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.borrowDetails = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();

        this.GetAllCondition();
        this.GetAllstaff();
    }

    getData() {
        this.borrowDetails = new Registrasionlist();
        if (this.viewId > 0) {
            this.approvalManagementService.getInforBorrowSlipById({ Id: this.viewId }).subscribe((data: any) => {
                this.borrowDetails = data.Data;

                console.log(this.borrowDetails);

                this.borrowDetails.ReimburseStaffId = 1;
                if (this.borrowDetails.ReimburseStaffId == 0) {
                    this.borrowDetails.ReimburseStaffId = null;
                }
                if (this.borrowDetails.ReimburseStatus == 0) {
                    this.borrowDetails.ReimburseStatus = null;
                }

                this.documentList = data.Data.DocRequests;
            });
        }
    }

    GetAllstaff() {
        this.approvalManagementService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }

    GetAllCondition() {
        this.approvalManagementService.getAllCondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }

    onSubmit(value: any) {
        let listcheck = [];
        let check = true;

        for (var i = 0; i < this.documentList.length; i++) {
            var assets = this.documentList[i];
            if (assets.Selected) {
                if (this.documentList[i].ReimburseStatus == undefined) {
                    check = false;
                }

                listcheck.push({
                    Id: assets.Id,
                    ReimburseStatus: this.documentList[i].ReimburseStatus,
                });
            }
        }

        let data = {
            Id: this.viewId,
            ReimburseName: value.ReimburseName,
            ReimburseStaffId: value.ReimburseStaffId,
            ReimburseNote: value.ReimburseNote || null,
            DocRequests: listcheck,
        };

        if (listcheck.length > 0 && check) {
            console.log(data);
            this.approvalManagementService.returnBorrowSlip(data).subscribe(() => {
                this.toastr.success(`Thành công`);
                this.dialogRef.close(1);
                this.getData();
            });
        } else if (listcheck.length == 0) {
            this.toastr.warning(`Bạn chưa chọn tài liệu nào`);
        } else {
            this.toastr.warning(`Bạn chưa chọn tình trạng khi trả`);
        }
    }

    viewDetails(Id: number) {
        const dialogRef = this.dialog.originalOpen(DetailsDocument, {
            width: '1200px',
            data: { viewId: Id },
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
