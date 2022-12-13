import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { DocofrequestService } from './Docofrequest.service';
import { PageEvent } from '@angular/material/paginator';
import { Returnrecord } from 'app/models/Returnrecord';
import { Record } from 'app/models/Record';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Docofrequest } from 'app/models/Docofrequest';
import { CreateDocumentArchivesViewComponent } from '../list/documentArchivesView-form.component';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';

@Component({
    selector: 'dialog-docofrequest-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-docofrequest-form.html',
})
export class CreateDocofrequestComponent {
    docofrequest: Registrasionlist;

    datalist: any;
    viewId: any;
    fileList: any;
    fondList: any;
    InforList: any;
    UserList: any;
    StatusName: any;
    departmentList: any;
    conditionList: any;

    NameDocumentOriginal: string;

    constructor(
        private docofrequestService: DocofrequestService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateDocofrequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.docofrequest = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        debugger;
        this.docofrequest = new Registrasionlist();
        if (this.viewId > 0) {
            this.docofrequestService.getbyid_doc({ Id: this.viewId }).subscribe((data: any) => {
                this.docofrequest = data.Data;
                this.InforList = data.Data.DocRequests;
            });
        }
        this.GetAllstaff();
        this.GetAllDepartment();
        this.GetAllFondName();
        this.getallcondition();
    }

    GetAllFondName() {
        this.docofrequest = new Registrasionlist();
        this.docofrequestService.GetAllFondName({}).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }
    FormatList = [
        { FormatId: 1, FormatName: 'Bản gốc' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];
    getallcondition() {
        this.docofrequestService.getallcondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }
    onClose(): void {
        this.dialogRef.close(0);
    }

    getInfoByRegistrasionlist($event) {
        if (this.docofrequest.RecordId > 0 && (this.viewId == null || this.viewId == 0)) {
            this.docofrequestService.getbyBorrowRequestId({ id: $event }).subscribe((data: any) => {
                this.InforList = data.Data;
            });
        }
    }
    public uploadFinished = (event) => {
        if (event.Success) {
            this.docofrequest.DecisionFile = event.Name;
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };
    getrecordbyunit($event) {
        this.docofrequestService.getrecordbyunit({ id: $event }).subscribe((data: any) => {
            this.fileList = data.Data;
        });
    }
    GetAllstaff() {
        this.docofrequestService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
        });
    }

    GetAllDepartment() {
        this.docofrequestService.GetAllDepartment({}).subscribe((data: any) => {
            this.departmentList = data.Data.Departments;
        });
    }
    getfond($event) {
        this.docofrequestService.getfond({ id: $event }).subscribe((data: any) => {
            this.fondList = data.Data;
        });
    }
    setViewId(id) {
        this.viewId = id;
    }
    // ArchiveView(value: any) {
    //   this.setViewId(value.DocumentArchiveId);
    //   const dialogRef = this.dialog.originalOpen(CreateDocumentArchivesViewComponent, {
    //     width: '800px',
    //     data: { viewId: value.DocumentArchiveId },
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     if (result == "1") this.getData();
    //   });
    // }
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
