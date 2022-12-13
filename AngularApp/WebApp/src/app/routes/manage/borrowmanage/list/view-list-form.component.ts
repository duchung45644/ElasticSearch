//import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    Output,
} from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

import { ListService } from './list.service';
import { PageEvent } from '@angular/material/paginator';
import { Returnrecord } from 'app/models/Returnrecord';
import { Record } from 'app/models/Record';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Docofrequest } from 'app/models/Docofrequest';
import { CreateDocumentArchivesViewComponent } from './documentArchivesView-form.component';
//ViewDocumentArchiveComponent
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';
@Component({
    selector: 'view-list-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './view-list-form.html',
})
export class CreateViewListComponent {
    @Output() refreshList = new EventEmitter();
    list: Registrasionlist;
    datalist: any;
    returnrecord: Returnrecord;
    record: Record;
    docofrequest: Docofrequest;
    viewId: any;
    fileList: any;
    fondList: any;
    InforList: any;
    UserList: any;
    // CheckAll = false;
    departmentList: any;
    conditionList: any;
    // refreshList: any;

    constructor(
        private listService: ListService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateViewListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.list = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
        // this.getDataList();
    }

    getData() {
        this.list = new Registrasionlist();
        if (this.viewId > 0) {
            this.listService.getbyRecord({ Id: this.viewId }).subscribe((data: any) => {
                this.list = data.Data;
                this.InforList = data.Data.DocRequests;
            });
        }
        this.GetAllstaff();
        this.GetAllDepartment();
        this.GetAllFondName();
        this.getallcondition();
    }

    GetAllFondName() {
        this.list = new Registrasionlist();
        this.listService.GetAllFondName({}).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }

    onClose(): void {
        this.dialogRef.close(0);
    }

    // CheckAllList($event){
    //   this.CheckAll = $event;
    //   this.InforList.forEach(function (value) {
    //     value.Selected = $event;
    //   });
    // }
    getallcondition() {
        this.listService.getallcondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }
    getInfoByRegistrasionlist($event) {
        if (this.list.RecordId > 0 && (this.viewId == null || this.viewId == 0)) {
            this.listService.getbyBorrowRequestId({ id: $event }).subscribe((data: any) => {
                this.InforList = data.Data;
            });
        }
    }
    public uploadFinished = (event) => {
        if (event.Success) {
            this.list.DecisionFile = event.Name;
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

    FormatList = [
        { FormatId: 1, FormatName: 'Bản gốc' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];
    getfond($event) {
        this.listService.getfond({ id: $event }).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }
    RefuseApproval(dataRegistrasionlist) {
        this.dialog.confirm('Bạn có muốn từ chối không?', () => {
            var listcheck = [];
            for (var i = 0; i < this.InforList.length; i++) {
                var assets = this.InforList[i];
                if (assets.Selected) {
                    listcheck.push(assets);
                }
            }
            var data = {
                Id: this.list.Id,
                Votes: this.list.Votes,
                RegisterUser: this.list.RegisterUser,
                Referral: this.list.Referral,
                SendingPlace: this.list.SendingPlace,
                DecisionFile: this.list.DecisionFile,
                UnitId: this.list.UnitId,
                CardId: this.list.CardId,
                FondId: this.list.FondId,
                RecordId: this.list.RecordId,
                AppointmentDate: this.list.AppointmentDate,
                BrowingStatus: this.list.BrowsingStatus,
                DocRequests: listcheck,
            };
            this.listService.Browsingsave(data).subscribe((data: any) => {
                this.toastr.success(`Đã từ chối!`);
                this.dialogRef.close(1);
                // window.location.reload();
            });
        });
    }

    onSubmit(dataRegistrasionlist) {
        var listcheck = [];
        for (var i = 0; i < this.InforList.length; i++) {
            var assets = this.InforList[i];
            if (assets.Selected) {
                listcheck.push(assets);
            }
        }
        var data = {
            Id: this.list.Id,
            Votes: this.list.Votes,
            RegisterUser: this.list.RegisterUser,
            Referral: this.list.Referral,
            SendingPlace: this.list.SendingPlace,
            DecisionFile: this.list.DecisionFile,
            UnitId: this.list.UnitId,
            CardId: this.list.CardId,
            FondId: this.list.FondId,
            RecordId: this.list.RecordId,
            AppointmentDate: this.list.AppointmentDate,

            DocRequests: listcheck,
        };
        this.listService.listsave(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
            this.refreshList.emit('refresh');
            // this.getData();
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
