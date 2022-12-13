import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { RecordService } from './record.service';

import { Record } from '../../../models/Record';
import { ConfigService } from '@core/bootstrap/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateDocumentArchiveComponent } from '../documentarchive/documentarchive-form.component';
import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
    selector: 'viewlform',
    templateUrl: './view-form.component.html',
    styleUrls: ['./record.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RecordService],
})
export class ViewFormComponent {
    columns: MtxGridColumn[] = [
        { header: 'Mã định danh văn bản', field: 'DocCode', width: '300px', sortable: true },
        { header: 'Trích yếu nội dung', field: 'Abstract', width: '300px', sortable: true },
        { header: 'Số ký hiệu văn bản', field: 'Number', sortable: true },
        { header: 'Tình trạng vật lý', field: 'ConditionName', sortable: true },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'edit',
                    tooltip: 'Cập nhật',
                    type: 'icon',
                    click: (record) => this.editDocumentArchive(record),
                },
            ],
        },
    ];

    isLoading = false;
    viewId: number;
    query = {
        RecordId: 0,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    disable: boolean = true;
    record: Record;
    shelfList: any;
    BoxList: any;
    warehouseList: any;
    list: any;
    total: any;
    documentArchiveList: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private RecordService: RecordService,
        public dialog: MtxDialog,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialogo: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.viewId = data.viewId;
        this.record = new Record();
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.record = new Record();
        this.query.RecordId = this.viewId;
        this.RecordService.getbypageDocumentArchive(this.params).subscribe((data: any) => {
            this.record = data.Data;
            this.list = data.DocumentArchive.ListObj;
            this.total = data.DocumentArchive.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
        this.getallWarehouse();
        if ((this.documentArchiveList = [])) {
            this.disable = true;
        }
    }

    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getData();
    }

    clearsearch() {
        this.query.PageIndex = 0;
        this.query.KeyWord = '';
        this.query.SortDirection = 'desc';
        this.getData();
    }

    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }

    getallWarehouse() {
        this.RecordService.getallWarehouse({}).subscribe((data: any) => {
            this.warehouseList = data.Data.Warehouses;
        });
    }

    getShelftByWarehouse($event) {
        this.record.ShelfId = null;
        if (this.record.WareHouseId > 0) {
            this.RecordService.getShelfByWareHouse({ Id: this.record.WareHouseId }).subscribe((data: any) => {
                this.shelfList = data.Data;
                this.cdr.detectChanges();
            });
        } else {
            this.shelfList = [];
        }
    }

    getBoxByShelf($event) {
        this.record.BoxId = null;
        if (this.record.ShelfId > 0) {
            this.RecordService.getBoxbyShelft({ Id: this.record.ShelfId }).subscribe((data: any) => {
                this.BoxList = data.Data;
                this.cdr.detectChanges();
            });
        } else {
            this.BoxList = [];
        }
    }

    rowselect(e: any) {
        this.documentArchiveList = e;
        if (this.documentArchiveList != 0) {
            this.disable = false;
        } else {
            this.disable = true;
        }
    }

    CreateDocumentArchive() {
        const dialogRef = this.dialog.originalOpen(CreateDocumentArchiveComponent, {
            width: '2000px',
            data: { viewId: this.viewId, value: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    editDocumentArchive(value: any) {
        debugger;
        const dialogRef = this.dialog.originalOpen(CreateDocumentArchiveComponent, {
            width: '2000px',
            data: { viewId: this.viewId, value: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    search() {
        this.query.PageIndex = 0;
        this.getData();
    }

    Delete(): void {
        if (this.documentArchiveList == undefined || this.documentArchiveList.length <= 0) {
            this.toastr.error(`Vui lòng chọn hồ sơ!`);
            return;
        }
        // this.dialog.confirm('Bạn có muốn xóa sơ được chọn?', () => {
        //     var listdocumentArchiveCheck = [];
        //     for (var i = 0; i < this.documentArchiveList.length; i++) {
        //         var documentArchivelists = this.documentArchiveList[i].Id;
        //         listdocumentArchiveCheck.push(documentArchivelists);
        //     }
        //     this.RecordService.deleteDocumentArchive({ documentArchiveList: listdocumentArchiveCheck }).subscribe(
        //         (data: any) => {
        //             this.toastr.success(`Đã xóa hồ sơ thành công!`);
        //             this.getData();
        //         },
        //     );
        // });
        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn xóa sơ được chọn?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listdocumentArchiveCheck = [];
                    for (var i = 0; i < this.documentArchiveList.length; i++) {
                        var documentArchivelists = this.documentArchiveList[i].Id;
                        listdocumentArchiveCheck.push(documentArchivelists);
                    }
                    this.RecordService.deleteDocumentArchive({
                        documentArchiveList: listdocumentArchiveCheck,
                    }).subscribe((data: any) => {
                        this.toastr.success(`Đã xóa hồ sơ thành công!`);
                        this.getData();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }
}
