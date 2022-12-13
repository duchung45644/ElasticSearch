import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DetailsDocument } from '../../documentarchive/details-document';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';
import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'extend-borrow-slip',
    templateUrl: './extend-borrow-slip.html',
    styleUrls: ['./borrow-return-extend-document.component.scss'],
})
export class ExtendBorrowSlip {
    viewId: any;
    borrowDetails: any;
    documentList: any;

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public datepipe: DatePipe,
        public dialogRef: MatDialogRef<ExtendBorrowSlip>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.borrowDetails = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.borrowDetails = new Registrasionlist();
        if (this.viewId > 0) {
            this.approvalManagementService.getInforBorrowSlipById({ Id: this.viewId }).subscribe((data: any) => {
                this.borrowDetails = data.Data;
                console.log(data.Data);
                this.documentList = data.Data.DocRequests;
            });
        }
    }

    refuseExtend(value: any) {
        let data = {
            Id: this.viewId,
            TotalRowCount: 0, //Use to approval because approval and refuse has the same stored procedure
            //0: Refuse, 1: Approval
        };

        this.approvalManagementService.extendBorrowSlip(data).subscribe(() => {
            this.toastr.success(`Từ chối gia hạn thành công`);
            this.dialogRef.close(1);
        });
    }

    onSubmit(value: any) {
        var listcheck = [];
        var count = 0;
        for (var i = 0; i < this.documentList.length; i++) {
            var assets = this.documentList[i];
            if (assets.Selected) {
                count++;
                listcheck.push({
                    Id: assets.Id,
                    ExtendDate: assets.ExtendDate,
                });
            } else {
                listcheck.push({
                    Id: assets.Id,
                    ExtendDate: null,
                });
            }
        }

        let data = {
            Id: this.borrowDetails.Id,
            TotalRowCount: 1, //Use to approval because approval and refuse has the same stored procedure
            //0: Refuse, 1: Approval

            DocRequests: listcheck,
        };

        console.log(data);

        this.approvalManagementService.extendBorrowSlip(data).subscribe(() => {
            this.toastr.success(`Phê duyệt gia hạn thành công`);
            this.dialogRef.close(1);
        });
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
}
