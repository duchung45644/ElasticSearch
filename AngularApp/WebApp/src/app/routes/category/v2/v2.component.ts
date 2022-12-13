import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { V2Service } from './v2.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

// import { V2 } from "../../../models/v2";
import { CreateV2Component } from './v2-form.component';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-v2',
    templateUrl: './v2.component.html',
    styleUrls: ['./v2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [V2Service],
})
export class V2Component implements OnInit {
    columns: MtxGridColumn[] = [];
    list = [];
    total = 0;
    isLoading = false;
    pageTitle: string;
    viewId: number;

    message: string;

    showSearch = false;

    formJson: any;
    formcode: string;
    query = {
        Code: '',
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    sub: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private v2Service: V2Service,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,

        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.router.events.pipe(filter((event) => event instanceof ActivationEnd)).subscribe((event) => {
            console.log(event);
        });
        this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
                return `0 của ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} của ${length}`;
        };
        var conf = this.config.getConfig();
        this.query.PageSize = conf.pageSize;

        this.sub = this.activatedRoute.params.subscribe((params) => {
            let formcode = params['code'];
            this.formcode = formcode.toUpperCase();
            this.getFormJson(formcode);
        });
    }
    ngOnInit() {
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản ghi:';
    }

    getData() {
        this.isLoading = true;
        switch (this.formcode) {
            case 'PUBLICSECTOR':
                {
                    this.v2Service.publicsector_getByPage(this.params).subscribe((res: any) => {
                        this.list = res.Data.ListObj;
                        this.total = res.Data.Pagination.NumberOfRows;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    });
                }
                break;
            case 'PROCEDURE':
                {
                    this.v2Service.procedure_getByPage(this.params).subscribe((res: any) => {
                        this.list = res.Data.ListObj;
                        this.total = res.Data.Pagination.NumberOfRows;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    });
                }
                break;
            default:
                break;
        }
    }

    getFormJson(formcode) {
        this.isLoading = true;
        this.columns = [];
        this.v2Service.GetFormJsonByCode({ Id: formcode }).subscribe((res: any) => {
            if (res.Data == undefined) {
                this.toastr.success(`Không tìm thấy cấu hình form!`);
            } else {
                this.formJson = res.Data;
            }
            this.formJson = res.Data;
            this.pageTitle = res.Data.FormName;
            this.isLoading = false;

            let objForm = JSON.parse(res.Data.FormJson);
            let objCol = objForm.columns;
            for (let index = 0; index < objCol.length; index++) {
                const element = objCol[index];
                this.columns.push(element);
            }
            this.columns.push({
                header: 'Thao Tác',
                field: 'option',
                width: '120px',
                pinned: 'right',
                right: '0px',
                type: 'button',
                buttons: [
                    {
                        icon: 'edit',
                        tooltip: 'Cập Nhật',
                        type: 'icon',
                        click: (record) => this.editV2(record),
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
                        click: (record) => this.deleteV2(record),
                    },
                ],
            });

            this.getData();
            this.cdr.detectChanges();
        });
    }

    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getData();
    }

    getSearchData() {
        this.getData();
    }

    clearsearch() {
        this.query.PageIndex = 0;
        this.query.KeyWord = '';

        this.query.SortField = '';
        this.query.SortDirection = 'desc';
        this.getData();
    }
    search() {
        this.query.PageIndex = 0;
        this.getData();
    }

    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }
    rowSelectionChangeLog(e: any) {
        console.log(e);
    }
    newV2() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateV2Component, {
            width: '800px',
            data: { viewId: 0, formcode: this.formcode, formJson: this.formJson },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result.code != undefined) if (result.code == '1') this.getData();
        });
    }
    setViewId(id) {
        this.viewId = id;
    }
    deleteV2(value: any) {
        switch (this.formcode) {
            case 'PUBLICSECTOR':
                {
                    this.v2Service.publicsector_delete({ Id: value.Id }).subscribe((data: any) => {
                        this.getData();
                        this.toastr.success(`Đã xoá ${value.V2Name}!`);
                    });
                }
                break;
            case 'PROCEDURE':
                {
                    this.v2Service.procedure_delete({ Id: value.Id }).subscribe((data: any) => {
                        this.getData();
                        this.toastr.success(`Đã xoá ${value.V2Name}!`);
                    });
                }
                break;
            default:
                break;
        }
    }

    editV2(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateV2Component, {
            width: '800px',
            data: { viewId: value.Id, formcode: this.formcode, formJson: this.formJson },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result.code != undefined) if (result.code == '1') this.getData();
        });
    }
}
