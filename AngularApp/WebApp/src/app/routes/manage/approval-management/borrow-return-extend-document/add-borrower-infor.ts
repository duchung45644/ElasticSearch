import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions';
import { Docofrequest } from 'app/models/Docofrequest';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ApprovalManagementService } from '../approval-management.service';

@Component({
    selector: 'add-borrower-infor',
    templateUrl: './add-borrower-infor.html',
})
export class AddBorrowerInfor {
    viewId: any;
    borrowerInfor: Docofrequest;
    UserList: any;
    conditionList: any;

    constructor(
        private approvalManagementService: ApprovalManagementService,
        public datepipe: DatePipe,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<AddBorrowerInfor>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.borrowerInfor = new Docofrequest();

        this.GetAllCondition();
        this.GetAllstaff();
    }

    ngOnInit() {}

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
        data.ReceiveDate = this.datepipe.transform(data.ReceiveDate);

        console.log(data.ReceiveDate);

        this.approvalManagementService.addBorrowerInfor(data).subscribe(() => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }
}
