import { Component, Inject, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RenewalprofileService } from './renewalprofile.service';
import { PageEvent } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { CreateDocumentArchivesViewComponent } from '../list/documentArchivesView-form.component';
import { ViewDocumentArchiveComponent } from '../../documentarchive/view-documentarchive.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
    selector: 'dialog-renewalprofile-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-renewalprofile-form.html',
})
export class CreateRenewalprofileComponent {
    @Input() refreshGrid: boolean = false;
    renewalprofile: Registrasionlist;
    renewalprofileList: any;
    UserList: any;
    viewId: any;
    InforList: any;
    fileList: any;
    apiUrl: string;
    CheckAll: any;
    ExtendDate: any;
    conditionList: any;
    // dates: any;
    constructor(
        public datepipe: DatePipe,
        private renewalprofileService: RenewalprofileService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateRenewalprofileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.renewalprofile = new Registrasionlist();
    }

    ngOnInit() {
        this.getData();
    }
    FormatList = [
        { FormatId: 1, FormatName: 'Bản gốc' },
        { FormatId: 2, FormatName: 'Bản điện tử' },
        { FormatId: 3, FormatName: 'Cả 2' },
    ];
    GetAllCondition() {
        this.renewalprofileService.getAllCondition({}).subscribe((data: any) => {
            this.conditionList = data.Data.Conditions;
        });
    }

    getData() {
        this.renewalprofile = new Registrasionlist();
        if (this.viewId > 0) {
            this.renewalprofileService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.renewalprofile = data.Data;
                this.InforList = data.Data.DocRequests;
            });
        }
        this.GetAllstaff();
    }

    getrecordbyunit($event) {
        this.renewalprofileService.getrecordbyunit({ id: $event }).subscribe((data: any) => {
            this.fileList = data.Data;
        });
    }

    CheckAllList($event) {
        this.CheckAll = $event;
        this.InforList.forEach(function (value) {
            value.Selected = $event;
        });
    }

    bindingDate(value) {
        this.InforList.forEach((element) => {
            element.ExtendDate = value;
        });
    }
    // checkRecord(value) {
    //     this.InforList.forEach((element) => {
    //         element.ReturnStatus == 1;
    //     });
    // }

    onSubmit(dataRenewalprofile) {
        var listcheck = [];
        for (var i = 0; i < this.InforList.length; i++) {
            var asset = this.InforList[i];
            if (asset.Selected) {
                listcheck.push(asset);
            }
            var data = {
                Id: this.renewalprofile.Id,
                Status: (this.renewalprofile.Status = 8),
                DocRequests: listcheck,
            };
            this.renewalprofileService.saverenewalprofile(data).subscribe((data: any) => {
                this.toastr.success(`Thành công`);
                this.dialogRef.close(1);
            });
        }
    }

    GetAllstaff() {
        this.renewalprofileService.GetAllStaff({}).subscribe((data: any) => {
            this.UserList = data.Data;
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
