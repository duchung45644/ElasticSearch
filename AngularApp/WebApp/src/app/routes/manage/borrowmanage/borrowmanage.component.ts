import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Record } from 'app/models/Record';
import { DatePipe } from '@angular/common';
import { BorrowmanageService } from './borrowmanage.service';
import { ConfigService } from '@core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MtxDialog, MtxGridColumn } from '@ng-matero/extensions';
import { CreateRegistrasionlistComponent } from './registrasionlist/registrasionlist-form.component';
import { CreateDocofrequestComponent } from './docofrequest/docofrequest-form.component';
import { CreateRenewalprofileComponent } from './renewalprofile/renewalprofile-form.component.';
import { CreateViewListComponent } from './list/view-list-form.component';
import { CreateAddinformationComponent } from './list/addinformation-form.component';
import { CreateShowAllComponent } from './list/showAll-form.component';
import { Docofrequest } from 'app/models/Docofrequest';
import { style } from '@angular/animations';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
    selector: 'app-borrowmanage',
    templateUrl: './borrowmanage.component.html',
    styleUrls: ['./borrowmanage.component.scss'],
})
export class BorrowmanageComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Số phiếu', field: 'Votes', width: '120px', sortable: true },
        { header: 'Người mượn', field: 'FullName', width: '120px', sortable: true },
        { header: 'Hồ sơ đăng ký', field: 'Title', width: '120px', sortable: true },
        {
            header: 'Ngày đăng ký',
            field: 'CreatedDate',
            width: '120px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '120px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày trả hồ sơ',
            field: 'ReimburseDate',
            width: '120px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                0: { text: 'Mới đăng ký', color: 'pink-300' },
                1: { text: 'Gửi yêu cầu đăng ký', color: 'yellow-100' },
                2: { text: 'Chờ phê duyệt' },
                3: { text: 'Đã trả hết', color: 'blue-100' },
                4: { text: 'Đã trả một phần', color: 'orange-100' },
                5: { text: 'Đã hủy', color: 'red-100' },
                6: { text: 'Đang mượn', color: 'green-100' },
                7: { text: 'Yêu cầu trả', color: 'green-100' },
                8: { text: 'Đang yêu cầu gia hạn', color: 'green-100' },
            },
        },
        {
            header: 'Chức Năng',
            field: 'option',
            width: '50px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'forward_10np',
                    tooltip: 'Chuyển dữ liệu',
                    type: 'icon',
                    click: (record) => this.cretedRegistrasionlist(record),
                    iif: (record) =>
                        record.Status == 6 ||
                        record.Status == 2 ||
                        record.Status == 8 ||
                        record.Status == 7 ||
                        record.Status == 4
                            ? false
                            : true,
                },
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editRegistrasionlist(record),
                    iif: (record) =>
                        record.Status == 6 || record.Status == 8 || record.Status == 7 || record.Status == 4
                            ? false
                            : true,
                },
                {
                    icon: 'alarm_add',
                    tooltip: 'Gia hạn hồ sơ',
                    type: 'icon',
                    click: (record) => this.editRenewalprofile(record),
                    iif: (record) => (record.Status == 0 || record.Status == 2 || record.Status == 8 ? false : true),
                },
                {
                    icon: 'undo',
                    tooltip: 'Thu hồi phiếu mượn',
                    type: 'icon',
                    click: (record) => this.DeleteRegis(record),
                    iif: (record) =>
                        record.Status == 6 ||
                        record.Status == 0 ||
                        record.Status == 3 ||
                        record.Status == 4 ||
                        record.Status == 8 ||
                        record.Status == 7
                            ? false
                            : true,
                },
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Thông tin phiếu mượn',
                    type: 'icon',
                    click: (record) => this.viewList(record),
                },
            ],
        },
    ];

    Logbookborrowedcolumns: MtxGridColumn[] = [
        { header: 'Tên hồ sơ mượn', field: 'Title', width: '150px', sortable: true },
        // { header: 'Người mượn', field: 'FullName', width: '150px', sortable: true },
        {
            header: 'Ngày mượn',
            field: 'ReceiveDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày hẹn trả',
            field: 'AppointmentDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Ngày trả',
            field: 'ReimburseDate',
            width: '150px',
            sortable: true,
            type: 'date',
            typeParameter: { format: 'dd/MM/yyyy' },
        },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',
            tag: {
                0: { text: 'Mới đăng ký', color: 'pink-300' },
                1: { text: 'Gửi yêu cầu đăng ký', color: 'yellow-100' },
                2: { text: 'Chờ phê duyệt' },
                3: { text: 'Đã trả hết', color: 'blue-100' },
                4: { text: 'Đã trả một phần', color: 'orange-100' },
                5: { text: 'Đã hủy', color: 'red-100' },
                6: { text: 'Đang mượn', color: 'green-100' },
                8: { text: 'Yêu cầu gia hạn', color: 'green-100' },
            },
        },
        {
            header: 'Chức Năng',
            field: 'option',
            width: '50px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'remove_red_eye',
                    tooltip: 'Xem chi tiết',
                    type: 'icon',
                    click: (record) => this.Viewdocofrequest(record),
                },
            ],
        },
    ];

    list = [];
    listAll = [];
    total = 0;
    totalAll = 0;
    isLoading = false;
    viewId: number;
    message: string;
    disableButton: boolean = true;
    disable: boolean = true;
    showSearch = false;
    Registrasionlist: Registrasionlist;
    docofrequest: Docofrequest;
    activeRegistrasionlist: any;
    provinceList: any;
    fondList: any;
    fileList: any;
    RegisList: any;
    apiBaseUrl: String;
    listReigstration: any;
    Status: boolean = false;
    query = {
        Status: null,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        DateAddStart: '',
        DateAddEnd: '',
        logbookborrowedForm: null,
        ReceiveDate: null,
        Title: null,
        ReceiverName: null,
        AppointmentDate: null,
        ReimburseDate: null,
    };
    listarray: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }

    constructor(
        private borrowmanageService: BorrowmanageService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private cdr: ChangeDetectorRef,
        public datepipe: DatePipe,

        private toastr: ToastrService,
        public dialogo: MatDialog,
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
        this.docofrequest = new Docofrequest();
        this.apiBaseUrl = conf.apiBaseUrl;
    }

    StatisticalReportAssets() {
        debugger;
        if (this.query.logbookborrowedForm == null || this.query.logbookborrowedForm == undefined) {
            this.query.logbookborrowedForm = 0;
        }
        debugger;
        if (this.query.ReceiveDate == null || this.query.ReceiveDate == undefined) {
            this.query.ReceiveDate = 0;
        }
        if (this.query.Title == null || this.query.Title == undefined) {
            this.query.Title = 0;
        }
        if (this.query.ReceiverName == null || this.query.ReceiverName == undefined) {
            this.query.ReceiverName = 0;
        }
        if (this.query.AppointmentDate == null || this.query.AppointmentDate == undefined) {
            this.query.AppointmentDate = 0;
        }
        if (this.query.ReimburseDate == null || this.query.ReimburseDate == undefined) {
            this.query.ReimburseDate = 0;
        }
        if (this.query.Status == null || this.query.Status == undefined) {
            this.query.Status = 0;
        }
        var start = this.datepipe.transform(this.query.DateAddStart, 'yyyy-MM-dd');
        var end = this.datepipe.transform(this.query.DateAddEnd, 'yyyy-MM-dd');
        if (start == '' || start == null) {
            start = '1990-01-01';
        }
        if (end == '' || end == null) {
            end = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');
        }
        window.open(
            `${this.apiBaseUrl}report/DownloadExcelStatisAccessmonitor?logbookborrowedForm=${this.query.logbookborrowedForm}&ReceiveDate=${this.query.ReceiveDate}&Title=${this.query.Title}&ReceiverName=${this.query.ReceiverName}&AppointmentDate=${this.query.AppointmentDate}&ReimburseDate=${this.query.ReimburseDate}&Status=${this.query.Status}&start=${start}&end=${end}`,
        );
    }

    ngOnInit() {
        debugger;
        this.getDataAll();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    tabChanged($event) {
        debugger;

        if ($event.tab.textLabel == 'Sổ theo dõi tài liệu mượn') {
            this.getData();
        } else {
            this.getDataAll();
        }
    }

    getData() {
        this.isLoading = true;
        this.borrowmanageService.getByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            console.log(this.list);
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
        if ((this.listReigstration = [])) {
            this.disableButton = true;
        }
    }

    getDataAll() {
        this.isLoading = true;
        this.borrowmanageService.getByPageAll(this.params).subscribe((res: any) => {
            this.listAll = res.Data.ListObj;
            this.totalAll = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
        if ((this.listReigstration = [])) {
            this.disableButton = true;
        }
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

    rowSelectionChangeLog(value: any) {
        this.listReigstration = value;
        if (value.length > 0) {
            this.disableButton = false;
        } else {
            this.disableButton = true;
        }
    }

    deleteRegistrasionlist(value: any) {
        this.borrowmanageService.deleteRegistrasionlist({ Id: value.Id }).subscribe((data: any) => {
            this.toastr.success(`Đã xoá ${value.RegistrasionlistName}!`);
        });
        this.getData();
    }

    cretedRegistrasionlist(value: any): void {
        // this.dialog.confirm('Bạn có xác nhận gửi yêu cầu mượn hồ sơ ?', () => {
        //     var data = { Id: value.Id };
        //     // console.log(data);
        //     this.borrowmanageService.ChangeRegistrasionlist(data).subscribe((data: any) => {
        //         this.toastr.success(`Đã chuyển vào danh sách phiếu mượn`);
        //         this.getDataAll();
        //     });
        // });
        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có xác nhận gửi yêu cầu mượn hồ sơ ?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var data = { Id: value.Id };
                    // console.log(data);
                    this.borrowmanageService.ChangeRegistrasionlist(data).subscribe((data: any) => {
                        this.toastr.success(`Đã chuyển vào danh sách phiếu mượn`);
                        this.getDataAll();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }

    newRegistrasionlist() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
            width: '1220px',
            height: '650px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            if (result == '1') this.getDataAll();
        });
    }
    newCancel(): void {
        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn hủy phiếu mượn?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var listRegistrasionlists = [];
                    var Registrasionlistss = [];
                    for (var i = 0; i < this.listReigstration.length; i++) {
                        var Registrasionlists = this.listReigstration[i];
                        Registrasionlistss.push(Registrasionlists);
                        var list = Registrasionlistss[i].Id;
                        listRegistrasionlists.push(list);
                    }
                    var data = {
                        ListRegistrasionlist_Cancel: listRegistrasionlists,
                    };
                    this.borrowmanageService.DeleteAll(data).subscribe((data: any) => {
                        this.toastr.success(`Đã hủy phiếu mượn thành công!`);
                        this.getDataAll();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }

    setViewId(id) {
        this.viewId = id;
    }

    ReturnTheRecords() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
            width: '800px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    editRegistrasionlist(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
            width: '1200px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getDataAll();
        });
    }
    editRenewalprofile(value: any) {
        debugger;
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateRenewalprofileComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getDataAll();
        });
    }

    viewList(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateViewListComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getDataAll();
        });
    }
    // ViewDetails(value: any) {
    //     const dialogRef = this.dialog.originalOpen(ViewDetails, {
    //         width: '1000px',
    //         data: { viewId: value.Id },
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log('The dialog was closed');
    //         if (result == '1') this.getData();
    //     });
    // }
    AddList(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateAddinformationComponent, {
            width: '1200px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    ViewAll(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateShowAllComponent, {
            width: '1000px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    Viewdocofrequest(value: any) {
        debugger;
        this.setViewId(value);
        const dialogRef = this.dialog.originalOpen(CreateDocofrequestComponent, {
            width: '1000px',
            data: { viewId: value.RegistrasionlistId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    getNodeErrorDateTimeStart($ErrorDateTimeStart) {
        var ErrorDateTimeStarte = this.datepipe.transform($ErrorDateTimeStart, 'yyyy-MM-dd HH:mm:ss');
        this.query.DateAddStart = ErrorDateTimeStarte;

        this.getData();
        this.cdr.detectChanges();
    }
    getNodeErrorDateTimeEnd($ErrorDateTimeEnd) {
        var ErrorDateTimeEnde = this.datepipe.transform($ErrorDateTimeEnd, 'yyyy-MM-dd HH:mm:ss');
        this.query.DateAddEnd = ErrorDateTimeEnde;

        this.getData();
        this.cdr.detectChanges();
    }

    DeleteRegis(value: any): void {
        this.setViewId(value);

        this.dialogo
            .open(DialogoConfirmacionComponent, {
                data: `Bạn có muốn thu hồi hồ sơ không?`,
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
                if (confirmado) {
                    var data = {
                        Id: value.Id,
                    };
                    this.borrowmanageService.deleteRegis(data).subscribe((data: any) => {
                        this.toastr.success(`Đã thu hồi hồ sơ thành công!`);
                        this.getDataAll();
                    });
                } else {
                    // this.dialogRef.close(1);
                }
            });
    }
}
