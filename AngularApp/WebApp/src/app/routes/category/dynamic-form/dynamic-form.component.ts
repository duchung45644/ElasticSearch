import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ConfigService } from '@core';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { CreateDynamicFormComponent } from './create-dynamic-form.component';
import { DynamicFormService } from './dynamic-form.service';
import { ViewDynamicFormComponent } from './view-dynamic-form.component';

@Component({
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DynamicFormService],
})
export class DynamicFormComponent implements OnInit {
    deleteformly(record: any): void {
        alert('Liên hệ admin');
    }

    columns: MtxGridColumn[] = [
        { header: 'Id', field: 'Id', width: '30px', hide: true },
        { header: 'FormCode', field: 'FormCode', width: '100px', sortable: false },
        { header: 'FormName', field: 'FormName', width: '300px', sortable: false },
        { header: 'Description', field: 'Description', sortable: false },
        {
            header: 'Khoá',
            field: 'IsLocked',
            type: 'tag',
            tag: {
                false: { text: 'Hoạt động', color: 'green-100' },
                true: { text: 'Dừng', color: 'red-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '200px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Hiển thị form test',
                    type: 'icon',
                    click: (record) => this.viewformly(record),
                },
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editformly(record),
                },
                {
                    icon: 'delete',
                    tooltip: 'Xoá',
                    color: 'warn',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận xoá ?',
                    popCloseText: 'Đóng',
                    popOkText: 'Đồng ý',
                    click: (record) => this.deleteformly(record),
                },
            ],
        },
    ];
    list = [];
    total = 0;
    isLoading = false;

    viewId: number;

    message: string;
    apiBaseUrl: string;
    showSearch = false;

    query: any;
    toast: any;

    form = new FormGroup({});
    model: any;

    options: FormlyFormOptions = {};
    fields: FormlyFieldConfig[];

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private formlyJsonschema: FormlyJsonschema,
        private formlyService: DynamicFormService,

        private config: ConfigService,

        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
    ) {
        var conf = this.config.getConfig();
        this.apiBaseUrl = conf.apiBaseUrl;
    }

    ngOnInit() {
        this.getData();
    }

    setViewId(id) {
        this.viewId = id;
    }
    getData() {
        this.isLoading = true;
        this.formlyService.GetAll({}).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    clearsearch() {
        this.getData();
    }
    search() {
        this.query.PageIndex = 0;
        this.getData();
    }

    newFormly() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateDynamicFormComponent, {
            width: '1000px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result.code != undefined) if (result.code == '1') this.getData();
            this.cdr.detectChanges();
        });
    }

    editformly(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateDynamicFormComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            if (result.code != undefined) if (result.code == '1') this.getData();

            this.cdr.detectChanges();
        });
    }

    viewformly(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(ViewDynamicFormComponent, {
            width: '1000px',
            data: { viewId: 0, formobj: value },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            // // if (result.code != undefined)
            // //   if (result.code == "1") this.getData();
            // // this.cdr.detectChanges();
        });
    }

    // constructor(private formService: DynamicFormService,
    //   private formlyJsonschema: FormlyJsonschema,
    //   private config: ConfigService,
    //   private cdr: ChangeDetectorRef,
    //   private toastr: ToastrService,
    //   public dialog: MtxDialog
    // ) {
    //   var conf = this.config.getConfig();
    //   this.apiBaseUrl = conf.apiBaseUrl;

    // }
    // ngOnInit(): void {

    //   var json = `{
    //     "schema": {
    //       "title": "A registration form",
    //       "description": "A simple form example.",
    //       "type": "object",
    //       "required": [
    //         "firstName",
    //         "lastName"
    //       ],
    //       "properties": {
    //         "firstName": {
    //           "type": "string",
    //           "title": "First name",
    //           "default": "Chuck"
    //         },
    //         "lastName": {
    //           "type": "string",
    //           "title": "Last name"
    //         },
    //         "age": {
    //           "type": "integer",
    //           "title": "Age"
    //         },
    //         "bio": {
    //           "type": "string",
    //           "title": "Bio"
    //         },
    //         "password": {
    //           "type": "string",
    //           "title": "Password",
    //           "minLength": 3
    //         },
    //         "telephone": {
    //           "type": "string",
    //           "title": "Telephone",
    //           "minLength": 10
    //         }
    //       }
    //     },
    //     "model": {
    //       "lastName": "Norris",
    //       "age": 75,
    //       "bio": "Roundhouse kicking asses since 1940",
    //       "password": "noneed"
    //     }
    //   }`;
    //   let obj = JSON.parse(json);
    //   this.getData(obj);
    // }

    // setViewId(id) {
    //   this.viewId = id;
    // }

    // newFormly() {

    //   this.setViewId(0);
    //   const dialogRef = this.dialog.originalOpen(CreateDynamicFormComponent, {
    //     width: '1000px',
    //     data: { viewId: 0 },
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     if (result.code != undefined)
    //       if (result.code == "1") this.getData(result.data.Data);
    //   });
    // }
    // getData(jsonForm) {

    //   debugger;
    //   this.form = new FormGroup({});
    //   this.options = {};
    //   this.fields = [this.formlyJsonschema.toFieldConfig(jsonForm.schema)];
    //   this.model = jsonForm.model;
    //   this.cdr.detectChanges();
    // }
    // submit() {
    //   alert(JSON.stringify(this.model));
    // }
}
