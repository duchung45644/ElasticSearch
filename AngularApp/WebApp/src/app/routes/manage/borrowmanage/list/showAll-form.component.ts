import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CreateDocumentArchivesViewComponent } from './documentArchivesView-form.component';
import { ListService } from './list.service';
import { PageEvent } from '@angular/material/paginator';
import { Returnrecord } from 'app/models/Returnrecord';
import { Record } from 'app/models/Record';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Docofrequest } from 'app/models/Docofrequest';
@Component({
    selector: 'dialog-showAll-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-showAll-form.html',
})
export class CreateShowAllComponent {
    showAll: Registrasionlist;
    datalist: any;
    returnrecord: Returnrecord;
    record: Record;
    docofrequest: Docofrequest;
    viewId: any;
    fileList: any;
    fondList: any;
    InforList: any;
    UserList: any;
    StatusName: any;
    departmentList: any;
    conditionList: any;

    FormatList = [
        { FormatId: 1, FormatName: 'Bản gốc' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];
    NameDocumentOriginal: string;

    constructor(
        private listService: ListService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateShowAllComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.showAll = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.showAll = new Registrasionlist();
        if (this.viewId > 0) {
            this.listService.getbyRecord({ Id: this.viewId }).subscribe((data: any) => {
                this.showAll = data.Data;
                this.InforList = data.Data.DocRequests;
            });
        }
        this.GetAllstaff();
        this.GetAllDepartment();
        this.GetAllFondName();
        this.getallcondition();
    }

    GetAllFondName() {
        this.showAll = new Registrasionlist();
        this.listService.GetAllFondName({}).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }
    getallcondition() {
        this.listService.getallcondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }

    onClose(): void {
        this.dialogRef.close(0);
    }

    getInfoByRegistrasionlist($event) {
        if (this.showAll.RecordId > 0 && (this.viewId == null || this.viewId == 0)) {
            this.listService.getbyBorrowRequestId({ id: $event }).subscribe((data: any) => {
                this.InforList = data.Data;
            });
        }
    }
    public uploadFinished = (event) => {
        if (event.Success) {
            this.showAll.DecisionFile = event.Name;
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };
    getrecordbyunit($event) {
        this.listService.getrecordbyunit({ id: $event }).subscribe((data: any) => {
            this.fileList = data.Data;
        });
    }
    GetAllstaff() {
        this.listService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }

    GetAllDepartment() {
        this.listService.GetAllDepartment({}).subscribe((data: any) => {
            this.departmentList = data.Data.Departments;
        });
    }
    getfond($event) {
        this.listService.getfond({ id: $event }).subscribe((data: any) => {
            this.fondList = data.Data;
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
