import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ListService } from './list.service';
import { PageEvent } from '@angular/material/paginator';
import { Docofrequest } from 'app/models/Docofrequest';
@Component({
    selector: 'dialog-addinformation-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-addinformation-form.html',
})
export class CreateAddinformationComponent {
    addinformation: Docofrequest;
    UserList: any;
    viewId: any;
    InforList: any;
    fileList: any;
    conditionList: any;
    apiUrl: string;
    constructor(
        public datepipe: DatePipe,
        private listService: ListService,
        private toastr: ToastrService,

        public dialogRef: MatDialogRef<CreateAddinformationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.addinformation = new Docofrequest();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.addinformation = new Docofrequest();
        if (this.viewId > 0) {
            this.listService.getbyid_List({ Id: this.viewId }).subscribe((data: any) => {
                this.addinformation = data.Data;
            });
        }
        this.GetAllstaff();
        this.getallcondition();
    }

    getallcondition() {
        this.listService.getallcondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }

    onSubmit(dataAddinformation) {
        var data = {
            Id: this.viewId,
            ReceiverName: this.addinformation.ReceiverName,
            ReceiveDate: this.addinformation.ReceiveDate,
            ReceiveStatus: this.addinformation.ReceiveStatus,
            LenderId: this.addinformation.LenderId,
            ReceiveNote: this.addinformation.ReceiveNote,
        };
        this.listService.saveAddinformation(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }

    StatusList = [
        { StatusId: 1, StatusName: 'Nguyên vẹn' },
        { StatusId: 0, StatusName: 'Không nguyên vẹn' },
    ];
    GetAllstaff() {
        this.listService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }
}
