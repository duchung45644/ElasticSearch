import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';

import { RegistrasionlistService } from './registrasionlist.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { CreateRegistrasionlistComponent } from './registrasionlist-form.component';

@Component({
    selector: 'app-registrasionlist',
    templateUrl: './registrasionlist.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RegistrasionlistService],
})
export class RegistrasionlistComponent implements OnInit {
    @Output() refreshList = new EventEmitter();

    columns: MtxGridColumn[] = [
        { header: 'Số phiếu', field: 'Votes', width: '210px', sortable: true },
        { header: 'Hồ sơ đăng ký', field: 'Title', width: '250px', sortable: true },
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
                },
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editRegistrasionlist(record),
                },
                {
                    icon: 'delete',
                    tooltip: 'Hủy phiếu mượn',
                    color: 'warn',
                    type: 'icon',
                    pop: true,
                    popTitle: 'Xác nhận hủy ?',
                    click: (record) => this.deleteRegistrasionlist(record),
                },
            ],
        },
    ];

    list = [];
    total = 0;
    isLoading = false;
    viewId: number;
    message: string;
    disableButton: boolean = true;
    showSearch = false;
    Registrasionlist: Registrasionlist;
    activeRegistrasionlist: any;
    provinceList: any;
    fondList: any;
    fileList: any;
    listReigstration: any;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    listarray: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private registrasionlistService: RegistrasionlistService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
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
    }

    ngOnInit() {
        this.getData();
        this.getSearchData();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }

    public uploadFile = (event) => {
        if (event.Success) {
            this.Registrasionlist.DecisionFile = event.Url;
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };

    getData() {
        this.isLoading = true;
        this.registrasionlistService.getByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
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
        if (value > 0) {
            this.disableButton = true;
        } else {
            this.disableButton = false;
        }
    }
    deleteRegistrasionlist(value: any) {
        this.registrasionlistService.deleteRegistrasionlist({ Id: value.Id }).subscribe((data: any) => {
            this.toastr.success(`Đã xoá ${value.RegistrasionlistName}!`);
        });
        this.getData();
    }

    cretedRegistrasionlist(value: any) {
        this.dialog.confirm('Bạn có muốn lập phiếu mượn không ?', () => {
            var data = { Id: value.Id };
            // console.log(data);
            this.registrasionlistService.ChangeRegistrasionlist(data).subscribe((data: any) => {
                this.toastr.success(`Đã chuyển vào danh sách phiếu mượn`);
                this.refreshList.emit('refresh');
                this.getData();
            });
        });
    }

    newRegistrasionlist() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateRegistrasionlistComponent, {
            width: '1220px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    //nut huy phieu muon
    newCancel() {
        this.dialog.confirm('Bạn có muốn hủy phiếu mượn', () => {
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
            this.registrasionlistService.DeleteAll(data).subscribe((data: any) => {
                this.toastr.success(`Đã hủy phiếu mượn thành công!`);
                this.getData();
            });
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
            if (result == '1') this.getData();
        });
    }
}
