import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RecordService } from './record.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { Record } from '../../../models/Record';
import { Router } from '@angular/router';
import { RecordViewComponent } from './record-viewform.component';
import { CookieService } from 'ngx-cookie-service';
import { Console } from 'console';
import { ViewFormComponent } from './view-form.component';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';
import { SettingsService } from '@core/bootstrap/settings.service';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { AttachmentOfDocumentArchive } from 'app/models/AttachmentOfDocumentArchive';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RecordService],
})
export class RecordComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã HS', field: 'FileCode', width: '300px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'MaintenanceName', sortable: true },
        { header: 'Chế độ sử dụng', field: 'RightName', sortable: true },
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
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editRecord(record),
                },
                {
                    icon: 'add_box',
                    tooltip: 'Hình thành hồ sơ',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Bạn có muốn hình thành hồ sơ ?',
                    popCloseText: 'Đóng',
                    popOkText: 'Đồng ý',
                    click: (record) => this.SaveFormativeRecord(record),
                },
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewRecord(record),
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
                    click: (record) => this.deleterecordId(record),
                },
            ],
        },
    ];

    columnsrecord: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã Hồ Sơ', field: 'FileCode', width: '150px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Tổng số tờ', field: 'TotalPaper', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'MaintenanceName', width: '100px', sortable: true },
        { header: 'Tên kho', field: 'WareHouseName', sortable: true },
        {
            header: 'Trạng thái lưu trữ',
            field: 'StorageStatus',
            type: 'tag',
            tag: {
                false: { text: 'Chưa lưu trữ', color: 'red-100' },
                true: { text: ' Đã lưu trữ', color: 'green-100' },
            },
        },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewRecordnoedit(record),
                },
                {
                    icon: 'save',
                    tooltip: 'Lưu trữ',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận lưu trữ ?',
                    popCloseText: 'Đóng',
                    popOkText: 'Đồng ý',
                    click: (record) => this.UpdateStorageStatus(record),
                    iif: (record) => (record.StorageStatus != true ? true : false),
                },
            ],
        },
    ];

    columnswaitdestroy: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã HS', field: 'FileCode', width: '300px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'MaintenanceName', sortable: true },
        { header: 'Chế độ sử dụng', field: 'RightName', sortable: true },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewRecordnoedit(record),
                },
                {
                    icon: 'cached',
                    tooltip: 'Gửi yêu cầu',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận chuyển đến chọn đợt tiêu hủy hồ sơ?',
                    popOkText: 'Đồng ý',
                    popCloseText: 'Đóng',
                    click: (record) => this.CreateApprove(record),
                },
            ],
        },
    ];

    columnsdestroy: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã HS', field: 'FileCode', width: '300px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'MaintenanceName', sortable: true },
        { header: 'Chế độ sử dụng', field: 'RightName', sortable: true },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewRecordnoedit(record),
                },
            ],
        },
    ];

    columnslostrecord: MtxGridColumn[] = [
        { header: 'Tiêu đề', field: 'Title', width: '300px', sortable: true },
        { header: 'Mã HS', field: 'FileCode', width: '300px', sortable: true },
        { header: 'Ký Hiệu', field: 'FileNotation', sortable: true },
        { header: 'Thời hạn bảo quản(Năm)', field: 'MaintenanceName', sortable: true },
        { header: 'Chế độ sử dụng', field: 'RightName', sortable: true },
        {
            header: 'Chức năng',
            field: 'option',
            width: '120px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.viewRecordnoedit(record),
                },
            ],
        },
    ];

    list = [];
    total = 0;
    isLoading = false;

    viewId: number;
    documentArchive: DocumentArchive;
    attachmentOfDocumentArchive: AttachmentOfDocumentArchive;
    message: string;
    isButtonDisabled: boolean = true;
    showSearch = false;
    record: Record;
    activeRecords: any;
    provinceList: any;
    Extension: any;
    status = 0;
    query = {
        Status: null,
        UnitId: null,
        Extension: '',
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    recordlist: any;
    RecordsWithImage: any;
    user: any;
    UnitId: number;
    doclist: any;
    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private RecordService: RecordService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private router: Router,
        private settings: SettingsService,
        public dialogo: MatDialog,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
    ) {
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
        this.user = settings.user;
        this.UnitId = this.user.UnitId;
    }

    ngOnInit() {
        this.getData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    getData() {
        this.isLoading = true;
        this.query.UnitId = this.UnitId;
        this.query.Extension = this.Extension;
        this.RecordService.getByPage(this.params).subscribe((res: any) => {
            this.list = [];

            // Get unique field list
            res.Data.ListObj.forEach((data) => {
                // Check if Field is in FileCode or not
                const isDuplicate = this.list.find(({ FileCode }) => FileCode === data.FileCode);

                // If not exists in the list push it into the list
                if (!isDuplicate) {
                    this.list.push(data);
                }
            });

            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
        this.GetExtension();
        if ((this.recordlist = [])) {
            this.isButtonDisabled = true;
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
        this.recordlist = e;
        if (e.length > 0) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    newRecord() {
        this.router.navigate(['/manage/record-form', 0]);
    }

    setViewId(id) {
        this.viewId = id;
    }
    CreateApprove(value: any) {
        this.setViewId(value.Id);
        this.router.navigate(['/manage/approve', value.Id]);
    }
    viewRecord(value: any) {
        const dialogRef = this.dialog.originalOpen(ViewFormComponent, {
            width: '1200px',
            height: '600px',
            data: { viewId: value.Id, warehoueId: value.WareHouseId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    viewRecordnoedit(value: any) {
        const dialogRef = this.dialog.originalOpen(RecordViewComponent, {
            width: '1200px',
            height: '600px',

            data: { viewId: value.Id, warehoueId: value.WareHouseId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    editRecord(value: any) {
        this.setViewId(value.Id);
        this.router.navigate(['/manage/record-detailform', value.Id]);
    }

    deleteAllRecord(): void {
        if (this.recordlist == undefined || this.recordlist.length < 0) {
            this.toastr.error(`Vui lòng chọn hồ sơ!`);
            return;
        }

        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn xóa hồ sơ được chọn?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listRecordCheck = [];
                    for (var i = 0; i < this.recordlist.length; i++) {
                        var recordlists = this.recordlist[i].Id;
                        listRecordCheck.push(recordlists);
                    }

                    this.RecordService.deleteRecord({ ListRecord: listRecordCheck }).subscribe((data: any) => {
                        this.toastr.success(`Đã xoá hồ sơ!`);
                        this.getData();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }

    tabChanged($event) {
        if ($event.tab.textLabel == 'Danh sách hồ sơ lưu trữ') {
            this.status = 0;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách hồ sơ hình thành') {
            this.status = 1;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách hồ sơ chờ tiêu hủy') {
            this.status = 2;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách hồ sơ bị tiêu hủy') {
            this.status = 4;
            this.query.KeyWord = '';
        } else if ($event.tab.textLabel == 'Danh sách hồ sơ báo mất') {
            this.status = 5;
            this.query.KeyWord = '';
        }

        this.query.Status = this.status;
        this.getData();
    }

    SaveFormativeRecord(value: any) {
        var data = {
            Id: value.Id,
        };
        this.RecordService.saveFormativeRecord(data).subscribe((data: any) => {
            this.toastr.success(`Hình thành hồ sơ thành công!`);
            this.getData();
        });
    }

    deleterecordId(value: any) {
        this.RecordService.DeleteRecordbyId({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.toastr.success(`Đã xoá ${value.Code}!`);
        });
    }

    BarcodeRecord() {
        if (this.recordlist == undefined || this.recordlist.length <= 0) {
            this.toastr.error(`Vui lòng chọn hồ sơ!`);
            return;
        }

        this.RecordService.BarCode({ ListRecords: this.recordlist }).subscribe((data: any) => {
            this.RecordsWithImage = data.Data;
            this.cdr.detectChanges();
            let element: HTMLElement = document.getElementById('printbtn') as HTMLElement;
            element.click();
        });
    }

    DestroyRecords(): void {
        if (this.recordlist == undefined || this.recordlist.length < 0) {
            this.toastr.error(`Vui lòng chọn hồ sơ!`);
            return;
        }

        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn hủy hồ sơ được chọn?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listRecordCheck = [];
                    for (var i = 0; i < this.recordlist.length; i++) {
                        var recordlists = this.recordlist[i].Id;
                        listRecordCheck.push(recordlists);
                    }

                    this.RecordService.waitDestroyRecord({ ListRecord: listRecordCheck }).subscribe((data: any) => {
                        this.toastr.success(`Đã hủy hồ sơ thành công!`);
                        this.getData();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }

    LostRecord(): void {
        if (this.recordlist == undefined || this.recordlist.length < 0) {
            this.toastr.error(`Vui lòng chọn hồ sơ!`);
            return;
        }

        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn báo mất hồ sơ được chọn?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listRecordCheck = [];
                    for (var i = 0; i < this.recordlist.length; i++) {
                        var recordlists = this.recordlist[i].Id;
                        listRecordCheck.push(recordlists);
                    }

                    this.RecordService.lostRecord({ ListRecord: listRecordCheck }).subscribe((data: any) => {
                        this.toastr.success(`Đã báo mất hồ sơ thành công!`);
                        this.getData();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }
    UpdateStorageStatus(value: any) {
        this.RecordService.UpdateStorageStatus({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.toastr.success(`Đã lưu trữ ${value.Title}!`);
        });
    }
    GetExtension() {
        debugger;
        this.attachmentOfDocumentArchive = new AttachmentOfDocumentArchive();
        this.RecordService.GetExtention({}).subscribe((data: any) => {
            this.doclist = data.Data;
        });
    }
}
