import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { DynamicFormService } from './dynamic-form.service';
import { Formly } from 'app/models/Formly';
import { MtxDialog } from '@ng-matero/extensions';
import { ViewDynamicFormComponent } from './view-dynamic-form.component';
@Component({
    selector: 'create-dynamic-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],
    templateUrl: './create-dynamic-form.html',
})
export class CreateDynamicFormComponent {
    viewId: any;
    model: Formly;
    constructor(
        private formService: DynamicFormService,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        public dialogRef: MatDialogRef<CreateDynamicFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.model = new Formly();
        if (this.viewId > 0) {
            this.formService.GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.model = data.Data;
            });
        }
    }
    form = new FormGroup({});

    options: FormlyFormOptions = {};

    fields: FormlyFieldConfig[] = [
        {
            key: 'FormCode',
            type: 'input',
            defaultValue: '',
            templateOptions: {
                label: 'Mã Form',
                required: true,
                appearance: 'outline',
            },
        },
        {
            key: 'FormName',
            type: 'input',
            defaultValue: '',
            templateOptions: {
                label: 'Tên Form',
                required: true,
                appearance: 'outline',
            },
        },
        {
            key: 'FormJson',
            type: 'textarea',
            templateOptions: {
                label: 'Cấu hình form dạng Json',
                placeholder: '',
                required: true,
                appearance: 'outline',
                rows: 20,
            },
        },
        {
            key: 'Description',
            type: 'textarea',
            templateOptions: {
                label: 'Mô tả',
                placeholder: '',
                rows: 2,
                appearance: 'outline',
            },
        },
        {
            key: 'IsLocked',
            type: 'checkbox',
            defaultValue: false,
            templateOptions: {
                label: 'Khoá',
            },
        },
    ];

    onClose(): void {
        this.dialogRef.close({ code: 0 });
    }

    viewformly() {
        const dialogRef = this.dialog.originalOpen(ViewDynamicFormComponent, {
            width: '1000px',
            data: { viewId: 0, formobj: this.model },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            // // if (result.code != undefined)
            // //   if (result.code == "1") this.getData();
            // // this.cdr.detectChanges();
        });
    }
    submit() {
        if (this.form.valid) {
            console.log(this.model);
            this.formService.SaveDynamicForm(this.model).subscribe((data: any) => {
                this.toastr.success(`Thành công`);
                this.dialogRef.close({ code: 1 });
            });
        }
    }
}
