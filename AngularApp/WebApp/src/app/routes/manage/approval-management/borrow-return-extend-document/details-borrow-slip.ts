import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DetailsDocument } from '../../documentarchive/details-document';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';
import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'details-borrow-slip',
    templateUrl: './details-borrow-slip.html',
    styleUrls: ['./borrow-return-extend-document.component.scss'],
})
export class DetailsBorrowSlip {
    viewId: any;
    details: any;
    documentList: any;

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<DetailsBorrowSlip>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.details = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.details = new Registrasionlist();
        if (this.viewId > 0) {
            this.approvalManagementService.getInforBorrowSlipById({ Id: this.viewId }).subscribe((data: any) => {
                this.details = data.Data;
                this.documentList = data.Data.DocRequests;
            });
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
