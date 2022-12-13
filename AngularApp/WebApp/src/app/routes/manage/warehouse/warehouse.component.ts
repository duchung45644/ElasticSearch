import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@core/bootstrap/config.service';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { WarehouseService } from './warehouse.service';
import { PageEvent } from '@angular/material/paginator';

import { Warehouse } from '../../../models/Warehouse';
import { Shelf } from '../../../models/Shelf';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [WarehouseService],
})
export class WarehouseComponent implements OnInit {
    list = [];
    total = 0;
    isLoading = false;
    loadingContent = false;

    viewId: number;
    isShelf: boolean;

    message: string;
    UnitId: number;
    showSearch = false;
    warehouse: Warehouse;
    activeWarehouses: any;
    statusList = [
        { Status: true, StatusName: 'Hoạt Động' },
        { Status: false, StatusName: 'Dừng hoạt động' },
    ];

    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',

        // thêm đk tìm kiếm
    };
    warehouseList: any;
    warehouseTree: any;
    KeyNodeSelected: number;
    categoryList: any;
    listParent: any;
    listLevel: any;
    shelf: Shelf;
    categoryListShelf: any;
    ListParents: any;
    user: any;

    constructor(
        private warehouseService: WarehouseService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
        private settings: SettingsService,
        private config: ConfigService,
    ) {
        var conf = this.config.getConfig();
        this.warehouse = new Warehouse();
        this.shelf = new Shelf();
        this.getWarehouseTree();
        this.isShelf = false;
        this.warehouseList = [];
        this.user = settings.user;
        // this.UnitId = this.user.UnitId;
        this.KeyNodeSelected = this.user.UnitId;
    }

    ngOnInit() {
        this.getall();
        this.getAllCategoryShelf();
        this.getAllCategory();
    }

    getAllCategory() {
        this.warehouseService.GetAllCategory({}).subscribe((data: any) => {
            this.categoryList = data.Data.Warehouse;
        });
    }

    getAllCategoryShelf() {
        this.warehouseService.getAllCategoryShelf({}).subscribe((data: any) => {
            this.categoryListShelf = data.Data.Shelf;
        });
    }
    getall() {
        this.warehouseService.getall({}).subscribe((data: any) => {
            this.warehouseList = data.Data.Warehouses;
        });
    }

    getWarehouseTree() {
        debugger;
        this.loadingContent = true;
        this.warehouseService
            .WarehouseTree({
                IsLoginUnitOnly: true,
                IsUnitOnly: true,
                KeyNodeSelected: this.KeyNodeSelected,
                // UnitId: this.UnitId,
            })
            .subscribe((data: any) => {
                this.warehouseList = data.Data.Warehouses;
                this.ListParents = data.Data.Parents;

                this.isShelf = false;
                this.getWarehouseDetail(this.KeyNodeSelected);
                // this.getall();

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
                        console.log($id);
                        this.isShelf = $id < 0 ? true : false;
                        if ($id < 0) {
                            this.getShelfDetail($id * -1);
                        } else {
                            this.getWarehouseDetail($id);
                        }
                    },
                });
                this.loadingContent = false;
                this.cdr.detectChanges();
            });
    }
    getShelfDetail($id) {
        this.isShelf = true;
        this.shelf = new Shelf();
        this.warehouse = new Warehouse();
        this.loadingContent = true;
        this.warehouseService.getshelfbyid({ Id: $id }).subscribe((data: any) => {
            this.shelf = data.Data;
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    reloadWarehouseTree() {
        this.loadingContent = true;
        this.warehouseService.WarehouseTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
            this.warehouseList = data.Data.Warehouses;
            this.ListParents = data.Data.Parents;

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

        this.warehouseService.getbyid({ Id: $id }).subscribe((data: any) => {
            this.warehouse = data.Data;
            // console.log(data.Data)
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }

    newWarehouse() {
        this.isShelf = false;
        var newWare = new Warehouse();
        newWare.ParentId = this.warehouse.Id;

        this.warehouse = newWare;
    }
    newShelf() {
        this.isShelf = true;
        var newShef = new Shelf();
        newShef.UnitId = this.warehouse.Id;
        newShef.WarehouseId = this.warehouse.Id;
        this.shelf = newShef;
    }

    setViewId(id) {
        this.viewId = id;
    }

    deleteWarehouse($id) {
        this.dialog.confirm(
            `Bạn có chắc chắn muốn xóa kho: ${this.warehouse.Name}?`,

            () => {
                this.loadingContent = true;
                this.warehouseService.deleteWarehouse({ Id: $id }).subscribe((data: any) => {
                    this.KeyNodeSelected = this.warehouse.ParentId;
                    this.isShelf = false;
                    this.getWarehouseDetail(this.warehouse.ParentId);
                    this.warehouse = new Warehouse();
                    this.loadingContent = false;
                    this.reloadWarehouseTree();
                    this.cdr.detectChanges();
                });
            },
            () => {},
        );
    }

    deleteshelf($id) {
        this.dialog.confirm(
            `Bạn có chắc chắn muốn xóa kệ: ${this.shelf.ShelfName} ?`,

            () => {
                this.loadingContent = true;
                this.warehouseService.deleteshelf({ Id: $id }).subscribe((data: any) => {
                    this.KeyNodeSelected = this.shelf.WarehouseId;
                    this.isShelf = false;
                    this.getWarehouseDetail(this.shelf.WarehouseId);
                    this.shelf = new Shelf();

                    this.loadingContent = false;
                    this.reloadWarehouseTree();
                    this.cdr.detectChanges();
                });
            },
            () => {},
        );
    }

    onSubmit(dataWarehouse) {
        var data = {
            Id: this.warehouse.Id,
            UnitId: this.UnitId,
            TypeId: this.warehouse.TypeId,

            Code: this.warehouse.Code,
            Name: this.warehouse.Name,
            PhoneNumber: this.warehouse.PhoneNumber,
            Address: this.warehouse.Address,
            Description: this.warehouse.Description,

            Status: this.warehouse.Status,
            IsUnit: this.warehouse.IsUnit,
            ParentId: this.warehouse.ParentId,
            AllowDocBook: this.warehouse.AllowDocBook,
            SortOrder: this.warehouse.SortOrder,
        };

        this.warehouseService.savewarehouse(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            // this.KeyNodeSelected = data.ReturnId;

            this.reloadWarehouseTree();
            // this.getWarehouseDetail( data.ReturnId);
            // this.getall();
        });
    }
    onSubmitShelf(dataWarehouse) {
        var data = {
            Id: this.shelf.Id,
            WarehouseId: this.shelf.WarehouseId,
            Code: this.shelf.Code,
            ShelfName: this.shelf.ShelfName,

            Capacity: this.shelf.Capacity,
            Tonnage: this.shelf.Tonnage,
            Size: this.shelf.Size,
            SortOrder: this.shelf.SortOrder,
            Description: this.shelf.Description,
            Status: this.shelf.Status,
            ParentId: this.shelf.ParentId,
            UnitId: this.shelf.UnitId,
            ShelfTypeId: this.shelf.ShelfTypeId,
        };

        this.warehouseService.saveshelf(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            // this.KeyNodeSelected = data.ReturnId;

            this.reloadWarehouseTree();
            // this.getShelfDetail( data.ReturnId);
        });
    }
}
