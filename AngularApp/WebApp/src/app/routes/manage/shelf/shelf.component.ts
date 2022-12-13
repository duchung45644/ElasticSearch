import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ShelfService } from './shelf.service';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Shelf } from '../../../models/Shelf';
import { CreateShelfComponent } from './shelf-form.component';
import { Category } from '../../../models/Category';
import { Warehouse } from '../../../models/Warehouse';
import { CreateBoxComponent } from './box-form.component';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
    selector: 'app-shelf',
    templateUrl: './shelf.component.html',
    styleUrls: ['./shelf.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ShelfService],
})
export class ShelfComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Tên Kệ', field: 'ShelfName', width: '200px', sortable: true },
        { header: 'Mã ký hiệu', field: 'Code', width: '150px', sortable: true },
        { header: 'Loại Kệ', field: 'ShelfTypeName', width: '150px', sortable: true },
        { header: 'Thứ/Tự', field: 'SortOrder', width: '100px', sortable: true },
        { header: 'Kho', field: 'WarehouseName', width: '150px', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            tag: {
                false: { text: 'Dừng Hoạt động', color: 'red-100' },
                true: { text: ' Hoạt động', color: 'green-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '150px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editShelf(record),
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
                    click: (record) => this.deleteShelf(record),
                },
            ],
        },
    ];
    columns1: MtxGridColumn[] = [
        { header: 'Tên hộp', field: 'BoxName', width: '200px', sortable: true },
        { header: 'Mã ký hiệu', field: 'Code', width: '150px', sortable: true },
        { header: 'Loại Hộp', field: 'BoxTypeName', width: '150px', sortable: true },
        { header: 'Thứ/Tự', field: 'SortOrder', width: '100px', sortable: true },
        { header: 'Kệ', field: 'ShelfNameBox', width: '150px', sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            tag: {
                false: { text: 'Dừng Hoạt động', color: 'red-100' },
                true: { text: ' Hoạt động', color: 'green-100' },
            },
        },
        {
            header: 'Thao Tác',
            field: 'option',
            width: '150px',
            pinned: 'right',
            right: '0px',
            type: 'button',
            buttons: [
                {
                    icon: 'edit',
                    tooltip: 'Cập Nhật',
                    type: 'icon',
                    click: (record) => this.editBox(record),
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
                    click: (record) => this.deleteBox(record),
                },
            ],
        },
    ];
    list = [];
    warelist = [];
    total = 0;
    isLoading = false;
    viewId: number;
    message: string;
    showSearch = false;
    shelf: Shelf;
    activeShelfs: any;
    warehouse: Warehouse;

    categoryList: any;
    activeWarehouses: any;
    warehouseList: any;
    warehouseTree: any;
    KeyNodeSelected: number;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        WarehouseId: '',
        ShelfTypeId: '',
        ShelfId: '',
    };
    listParent: any;
    listLevel: any;
    UnitId: number;
    isShelf: boolean;
    loadingContent: boolean;
    ListParents: any;
    user: any;
    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private shelfService: ShelfService,
        private config: ConfigService,
        public _MatPaginatorIntl: MatPaginatorIntl,
        private cdr: ChangeDetectorRef,
        private settings: SettingsService,
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
        this.warehouse = new Warehouse();
        this.getWarehouseTree();
        this.user = settings.user;
        this.UnitId = this.user.UnitId;
        this.KeyNodeSelected = this.user.UnitId;
    }
    ngOnInit() {
        this.getWarehouseTree();
        this.getDataWarehouse();
        this.getSearchData();
        // this.getAllCategory();
        this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    }
    getData() {
        this.isLoading = true;
        this.shelfService.getByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }
    getDataWarehouse() {
        this.isLoading = true;
        this.shelfService.getByPageWarehouse(this.params).subscribe((res: any) => {
            this.warelist = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    getWarehouseTree() {
        this.loadingContent = true;
        this.shelfService
            .WarehouseTree({
                IsLoginUnitOnly: true,
                IsUnitOnly: true,
                KeyNodeSelected: this.KeyNodeSelected,
                UnitId: this.UnitId,
            })
            .subscribe((data: any) => {
                this.warehouseList = data.Data.Warehouses;
                this.ListParents = data.Data.Parents;
                this.listLevel = data.Data.Levels;
                this.isShelf = false;
                this.getWarehouseDetail(this.KeyNodeSelected);
                // tree binding
                ($('#WarehouseTree') as any).fancytree({
                    source: this.warehouseList,
                    minExpandLevel: 2,
                    beforeExpand: function (event, data) {
                        return true;
                    },
                    extensions: ['filter'],
                    quicksearch: true,
                    filter: {
                        autoApply: true, // Re-apply last filter if lazy data is loaded
                        autoExpand: false, // Expand all branches that contain matches while filtered
                        counter: true, // Show a badge with number of matching child nodes near parent icons
                        fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
                        hideExpandedCounter: true, // Hide counter badge if parent is expanded
                        hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
                        highlight: true, // Highlight matches by wrapping inside <mark> tags
                        leavesOnly: false, // Match end nodes only
                        nodata: true, // Display a 'no data' status node if result is empty
                        mode: 'hide', // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                    },
                    activate: (event, data) => {
                        var $id = parseInt(data.node.key);
                        this.KeyNodeSelected = $id;
                        this.getNode($id);
                        console.log($id);
                        this.isShelf = $id < 0 ? true : false;
                        if ($id < 0) {
                            this.getShelfDetail($id * -1);
                        } else {
                            this.getWarehouseDetail($id);
                        }
                        // this.getWarehouseDetail($id);
                    },
                });
                // this.loadingContent=false;
                this.cdr.detectChanges();
            });
    }
    getNode($id) {
        this.query.WarehouseId = $id;
        this.query.ShelfId = $id;

        this.getData();
        this.getDataWarehouse();
        this.getShelfDetail(-$id);
        this.getWarehouseDetail($id);
    }

    getShelfDetail($id) {
        this.isShelf = true;
        this.shelf = new Shelf();
        this.warehouse = new Warehouse();
        this.loadingContent = true;
        this.query.ShelfId = $id;
        this.getData();
        this.shelfService.getshelfbyid({ Id: $id }).subscribe((data: any) => {
            this.shelf = data.Data;
            // this.warehouse=data.Data.Warehouses;
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    reloadWarehouseTree() {
        this.loadingContent = true;
        this.shelfService.WarehouseTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
            this.warehouseList = data.Data.Warehouses;
            this.ListParents = data.Data.Parents;
            this.listLevel = data.Data.Levels;
            // tree binding
            var tree = ($('#WarehouseTree') as any).fancytree('getTree');
            tree.reload(this.warehouseList);
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    getWarehouseDetail($id) {
        this.isShelf = false;
        this.warehouse = new Warehouse();
        this.shelf = new Shelf();
        this.loadingContent = true;
        this.query.WarehouseId = $id;

        this.getDataWarehouse();
        this.shelfService.getbytwarehouseid({ Id: $id }).subscribe((data: any) => {
            this.warehouse = data.Data;
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    getNextPage(e: PageEvent) {
        this.query.PageIndex = e.pageIndex;
        this.query.PageSize = e.pageSize;
        this.getData();
        this.getDataWarehouse();
    }
    getSearchData() {
        this.getData();
        // this.getAllCategory();
        this.getWarehouseTree();
    }
    clearsearch() {
        this.query.PageIndex = 0;
        this.query.KeyWord = '';
        this.query.SortField = '';
        this.query.SortDirection = 'desc';
        this.getData();
        this.getDataWarehouse();
    }
    search() {
        this.query.PageIndex = 0;
        this.getData();
        this.getDataWarehouse();
    }
    changeSort(e: any) {
        this.query.SortField = e.active;
        this.query.SortDirection = e.direction;
        this.search();
    }
    rowSelectionChangeLog(e: any) {
        console.log(e);
    }
    newShelf() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateShelfComponent, {
            width: '800px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getDataWarehouse();
        });
    }
    newBox() {
        this.setViewId(0);
        const dialogRef = this.dialog.originalOpen(CreateBoxComponent, {
            width: '800px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    editBox(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateBoxComponent, {
            width: '800px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }

    // viewrecord(value: any) {
    //     this.setViewId(value.Id);
    //     const dialogRef = this.dialog.originalOpen(ViewListRecordComponent, {
    //         width: '1200px',
    //         height: '650px',
    //         data: { viewId: value.Id },
    //     });
    //     dialogRef.disableClose = true;
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log('The dialog was closed');
    //         if (result == '1') this.getData();
    //     });
    // }
    deleteBox(value: any) {
        this.shelfService.deletebox({ Id: value.Id }).subscribe((data: any) => {
            this.getData();
            this.KeyNodeSelected = this.warehouse.ParentId;
            this.reloadWarehouseTree();
            this.getWarehouseDetail(this.warehouse.ParentId);
            this.toastr.success(`Đã xoá ${value.BoxName}!`);
        });
    }
    setViewId(id) {
        this.viewId = id;
    }
    deleteShelf(value: any) {
        this.shelfService.deleteshelf({ Id: value.Id }).subscribe((data: any) => {
            this.getDataWarehouse();
            this.KeyNodeSelected = this.warehouse.ParentId;
            this.reloadWarehouseTree();
            this.getWarehouseDetail(this.warehouse.ParentId);
            this.toastr.success(`Đã xoá ${value.ShelfName}!`);
        });
    }
    editShelf(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateShelfComponent, {
            width: '800px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getDataWarehouse();
        });
    }
}
