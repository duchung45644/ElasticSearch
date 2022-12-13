import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { FondService } from './fond.service';
import { PageEvent } from '@angular/material/paginator';

import { Fond } from '../../../models/fond';
@Component({
    selector: 'dialog-fond-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-fond-form.html',
})
export class CreateFondComponent {
    fond: Fond;
    fondList: any;
    viewId: any;
    categoryList: any;
    listParent: any;
    constructor(
        private fondService: FondService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<CreateFondComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.fond = new Fond();
    }

    ngOnInit() {
        this.getData();
    }
    getTree() {
        debugger;
        this.fondService.Init({}).subscribe((data: any) => {
            this.listParent = data.Data.Parents;
        });
    }
    getData() {
        this.fond = new Fond();
        if (this.viewId > 0) {
            this.fondService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.fond = data.Data;
            });
        }
        this.getallcategory();
        this.getTree();
    }

    getallcategory() {
        this.fondService.GetAllCategoryNgonNgu({}).subscribe((data: any) => {
            this.categoryList = data.Data.Fond;
        });
    }

    onSubmit(dataFond) {
        var data = {
            Id: this.fond.Id,
            FondCode: this.fond.FondCode,
            ParentId: this.fond.ParentId,
            FondName: this.fond.FondName,
            UnitId: this.fond.UnitId,
            ArchivesTime: this.fond.ArchivesTime,
            FondHistory: this.fond.FondHistory,
            PaperTotal: this.fond.PaperTotal,
            PaperDigital: this.fond.PaperDigital,
            CoppyNumber: this.fond.CoppyNumber,
            LanguageId: this.fond.LanguageId,
            KeysGroup: this.fond.KeysGroup,
            LookupTools: this.fond.LookupTools,
            Description: this.fond.Description,
            OtherType: this.fond.OtherType,
            DepartmentId: this.fond.DepartmentId,
        };
        this.fondService.savefond(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            // this.dialogRef.close(1);
        });
    }
}
