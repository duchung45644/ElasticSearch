import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DetailsDocument } from '../../documentarchive/details-document';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';

import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'accept-borrow-slip',
    templateUrl: 'accept-borrow-slip.html',
    styleUrls: ['./borrow-slip-list.component.scss'],
})
export class AcceptBorrowSlip implements OnInit {
    viewId: number;
    documentList: any;
    list: Registrasionlist;
    inforBorrowSlip: Registrasionlist;
    lockTpl: any;
    acceptType: any;

    borrowTypeList = [
        { Id: 1, Name: 'Bản gốc' },
        { Id: 2, Name: 'Bản điện tử' },
        { Id: 3, Name: 'Cả 2 bản' },
    ];

    query = {
        Status: null,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        DateAddStart: '',
        DateAddEnd: '',
        logbookborrowedForm: null,
        ReceiveDate: null,
        Title: null,
        ReceiverName: null,
        AppointmentDate: null,
        ReimburseDate: null,
    };

    constructor(
        private approvalManagementService: ApprovalManagementService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<AcceptBorrowSlip>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.inforBorrowSlip = new Registrasionlist();
        if (this.viewId > 0) {
            this.approvalManagementService.getInforBorrowSlipById({ Id: this.viewId }).subscribe((data: any) => {
                this.inforBorrowSlip = data.Data;
                this.documentList = data.Data.DocRequests;
                this.documentList.forEach((e: any) => {
                    e.AgreeStatus = null;
                    if (e.BorrowType == 1 && e.BrowsingStatus == 3) {
                        e.borrowTypeList = [{ Id: 2, Name: 'Bản điện tử' }];
                    } else {
                        e.borrowTypeList = [
                            { Id: 1, Name: 'Bản gốc' },
                            { Id: 2, Name: 'Bản điện tử' },
                            { Id: 3, Name: 'Cả 2 bản' },
                        ];
                    }
                });
            });
        }
    }

    search() {
        this.query.PageIndex = 0;
        this.getData();
    }

    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }

    rowSelectionChangeLog(value: any) {
        // this.listReigstration = value;
        // if (value > 0) {
        //     this.disableButton = true;
        // } else {
        //     this.disableButton = false;
        // }
    }

    RefuseApproval() {
        let data = {
            Id: this.inforBorrowSlip.Id,
        };

        this.approvalManagementService.refuseBorrowSlip(data).subscribe((res: any) => {
            this.toastr.success('Từ chối thành công!');
            this.dialogRef.close(1);
            this.getData();
        });
    }

    Approval() {
        var listcheck = [];
        for (var i = 0; i < this.documentList.length; i++) {
            var assets = this.documentList[i];
            if (assets.Selected) {
                listcheck.push({
                    Id: assets.Id,
                    DocumentArchiveId: assets.DocumentArchiveId,
                    AgreeStatus: assets.AgreeStatus,
                });
            }
        }

        let data = {
            Id: this.inforBorrowSlip.Id,
            DocRequests: listcheck,
        };

        if (listcheck.length == 0) {
            this.toastr.warning('Bạn chưa chọn hồ sơ nào!');
        } else {
            this.approvalManagementService.approvalBorrowSlip(data).subscribe((res: any) => {
                this.toastr.success('Phê duyệt thành công!');
                this.dialogRef.close(1);
                this.getData();
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
        debugger;
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
