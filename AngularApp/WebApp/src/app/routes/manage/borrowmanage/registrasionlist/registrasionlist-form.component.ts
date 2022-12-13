import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RegistrasionlistService } from './registrasionlist.service';
import { PageEvent } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Record } from 'app/models/Record';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { Docofrequest } from 'app/models/Docofrequest';
import { SettingsService, User } from '@core';
import { event } from 'jquery';
import { DatePipe } from '@angular/common';
// import { Component } from '@angular/core';

@Component({
    selector: 'dialog-registrasionlist-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],
    templateUrl: './dialog-registrasionlist-form.html',
})
export class CreateRegistrasionlistComponent {
    user: User;
    registrasionlist: Registrasionlist;
    registrasionlistList: any;
    viewId: any;
    fondList: any;
    fileList: any;
    fondtlist: any;
    registrasionlistTree: any;
    record: Record;
    documentArchive: DocumentArchive;
    InforList: any;
    departmentList: any;
    UserList: any;
    FileArchive: any;
    Url: any;
    selected2: any;
    CheckAll = false;
    SelectValue = [];
    Docofrequest: any;
    FormatList = [
        { FormatId: 1, FormatName: 'Bản giấy', disable: false },
        { FormatId: 2, FormatName: 'Bản điện tử', disable: false },
        { FormatId: 3, FormatName: 'Cả 2', disable: false },
    ];

    List: any;
    constructor(
        private settings: SettingsService,
        public datepipe: DatePipe,
        private registrasionlistService: RegistrasionlistService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateRegistrasionlistComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.user = settings.user;
        this.viewId = data.viewId;
        this.registrasionlist = new Registrasionlist();
        this.documentArchive = new DocumentArchive();
    }

    ngOnInit() {
        this.getData();
        this.registrasionlist.RegisterUser = this.user.Id;
        this.registrasionlist.UnitId = this.user.UnitId;

        // this.getDataList();
    }

    getData() {
        this.registrasionlist = new Registrasionlist();
        if (this.viewId > 0) {
            this.registrasionlistService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.registrasionlist = data.Data;
                this.InforList = data.Data.DocRequests;
                this.InforList.forEach((e: any) => {
                    if (e.BrowsingStatus == 3) {
                        e.FormatList = [{ Id: 2, FormatName: 'Bản điện tử' }];
                    } else {
                        e.FormatList = [
                            { Id: 1, FormatName: 'Bản gốc' },
                            { Id: 2, FormatName: 'Bản điện tử' },
                            { Id: 3, FormatName: 'Cả 2 bản' },
                        ];
                    }
                });
                this.CheckAllList(true);
            });
        }

        this.GetAllDepartment();
        this.GetAllstaff();
    }

    GetAllDepartment() {
        this.registrasionlistService.GetAllDepartment({}).subscribe((data: any) => {
            this.departmentList = data.Data.Departments;
        });
    }

    GetAllstaff() {
        this.registrasionlistService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }

    GetAllAttachmentOfDocument() {
        this.registrasionlistService.GetAllAttachmentOfDocument({}).subscribe((data: any) => {
            this.FileArchive = data.Data;
        });
    }

    onClose(): void {
        this.dialogRef.close(0);
    }

    CheckAllList($event) {
        this.CheckAll = $event;
        this.InforList.forEach(function (value) {
            value.Selected = $event;
        });
    }

    getInfoByRegistrasionlist($event) {
        if (this.registrasionlist.RecordId > 0 && (this.viewId == null || this.viewId == 0)) {
            this.registrasionlistService.getbyBorrowRequestId({ id: $event }).subscribe((data: any) => {
                this.InforList = data.Data;
                this.InforList.forEach((e: any) => {
                    if (e.BrowsingStatus == 3) {
                        e.FormatList = [{ Id: 2, FormatName: 'Bản điện tử' }];
                    } else {
                        e.FormatList = [
                            { Id: 1, FormatName: 'Bản gốc' },
                            { Id: 2, FormatName: 'Bản điện tử' },
                            { Id: 3, FormatName: 'Cả 2 bản' },
                        ];
                    }
                });
                console.log(this.InforList);

                this.cdr.detectChanges();
            });
        }
    }

    public uploadFinished = (event) => {
        if (event.Success) {
            this.registrasionlist.DecisionFile = event.Name;
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };

    getrecordbyunit($event) {
        this.registrasionlistService.getrecordbyunit({ id: $event }).subscribe((data: any) => {
            this.fileList = data.Data;
        });
    }

    getfond($event) {
        this.registrasionlistService.getfond({ id: $event }).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }

    checkValue(usediary) {
        console.log(usediary);
        debugger;
        this.registrasionlistService.GetByRecordId({ id: usediary.DocumentArchiveId }).subscribe((data: any) => {
            this.List = data.Data;
            if (this.List == undefined) {
                this.FormatList = [
                    { FormatId: 1, FormatName: 'Bản giấy', disable: false },
                    { FormatId: 2, FormatName: 'Bản điện tử', disable: false },
                    { FormatId: 3, FormatName: 'Cả 2', disable: false },
                ];
                return;
            } else {
                if (this.List.DocumentArchiveId == usediary.DocumentArchiveId) {
                    this.FormatList = [{ FormatId: 2, FormatName: 'Bản điện tử', disable: false }];
                }
            }
        });
    }

    onSubmit(dataRegistrasionlist) {
        var listcheck = [];
        for (var i = 0; i < this.InforList.length; i++) {
            var asset = this.InforList[i];
            if (asset.Selected) {
                listcheck.push(asset);
            }
        }
        var data = {
            Id: this.registrasionlist.Id,
            Votes: this.registrasionlist.Votes,
            RegisterUser: this.registrasionlist.RegisterUser,
            Referral: this.registrasionlist.Referral,
            SendingPlace: this.registrasionlist.SendingPlace,
            DecisionFile: this.registrasionlist.DecisionFile,
            UnitId: this.registrasionlist.UnitId,
            CardId: this.registrasionlist.CardId,
            FondId: this.registrasionlist.FondId,
            RecordId: this.registrasionlist.RecordId,
            AppointmentDateStr: this.datepipe.transform(this.registrasionlist.AppointmentDate, 'dd/MM/yyyy'),

            DocRequests: listcheck,
        };
        this.registrasionlistService.saveregistrasionlist(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
        this.cdr.detectChanges();
    }
}
