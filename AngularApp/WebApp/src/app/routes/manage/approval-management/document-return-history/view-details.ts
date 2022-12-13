import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DetailsDocument } from '../../documentarchive/details-document';
import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'view-details',
    templateUrl: './view-details.html',
    styleUrls: ['./document-return-history.component.scss'],
})
export class ViewDetailsHistory {
    viewId: any;
    historyId: any;
    borrowDetails: any;
    documentList: any;
    UserList: any;
    conditionList: any;

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public datepipe: DatePipe,
        public dialogRef: MatDialogRef<ViewDetailsHistory>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.historyId = data.historyId;
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
            this.approvalManagementService
                .getHistoryDocumentByRegistrationId({ Id: this.viewId, HistoryId: this.historyId })
                .subscribe((data: any) => {
                    console.warn(data.Data);
                    this.borrowDetails = data.Data;
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

    onSubmit(data: any) {
        data.Id = this.viewId;
        this.approvalManagementService.returnBorrowSlip(data).subscribe(() => {
            this.toastr.success(`Thành công`);
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
