import { UnaffectedChild } from './../../../models/UnaffectedChild';
import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { UnaffectService } from './unaffected.service';
import { PageEvent } from '@angular/material/paginator';

import { Unaffected } from '../../../models/Unaffected';
import { CreateUnaffectedComponent } from './unaffected-form.component';

@Component({
    selector: 'app-unaffected',
    templateUrl: './unaffected.component.html',
    styleUrls: ['./unaffected.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UnaffectService],
})
export class UnaffectedComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: 'Mã', field: 'Code', width: '150px', sortable: true },
        { header: 'Tên', field: 'UnaffectChildName', width: '300px', sortable: true },

        { header: 'Thuộc chức năng', field: 'UnaffectedName', width: '150px', sortable: true },
        //{ header: 'Lãnh/Đạo', field: 'IsLeader',width: '100px', sortable: true },
        // { header: 'Mô Tả', field: 'Description',width: '350px',sortable: true },
        {
            header: 'Trạng thái',
            field: 'Status',
            type: 'tag',
            width: '120px',

            tag: {
                true: { text: 'Hoạt động', color: 'green-100' },
                false: { text: 'Dừng hoạt động', color: 'red-100' },
            },
        },

        {
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
                    click: (record) => this.editunaffectedchild(record),
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
                    click: (record) => this.deleteunaffectedchild(record),
                },
            ],
        },
    ];
    list = [];
    total = 0;
    isLoading = false;

    viewId: number;
    newId: number;

    message: string;

    showSearch = false;
    unaffected: Unaffected;
    activeRights: any;
    unaffectedChild: UnaffectedChild;
    query = {
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
        UnaffectedId: '',
        // thêm đk tìm kiếm
    };
    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    unaffectedList: any;
    unaffectedTree: any;
    KeyNodeSelected: number;

    constructor(
        private unaffectService: UnaffectService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
    ) {
        this.unaffected = new Unaffected();

        this.getTree();
    }

    ngOnInit() {
        this.getData();
        this.getTree();
    }
    getTree() {
        this.unaffectService.GetTree({}).subscribe((data: any) => {
            this.unaffectedList = data.Data.Unaffecteds;
            this.unaffectedTree = data.Data.UnaffectedTree;
            // tree binding
            ($('#UnaffectedTree') as any).fancytree({
                source: this.unaffectedTree,
                minExpandLevel: 1,
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
                    this.getUnaffectedDetail($id);
                    this.getNode($id);
                },
                // click: function (event, data) {
                //     var $id = parseInt(data.node.key);
                //     this.KeyNodeSelected = $id;
                //         this.isStaff = $id <0 ? true : false;
                //         if  ($id<0){
                //           this.getStaffDetail($id);
                //         }else{
                //           this.getDepartmentDetail($id);
                //         }

                // }
            });

            this.cdr.detectChanges();
        });
    }

    reloadTree() {
        this.unaffectService.GetTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
            this.unaffectedList = data.Data.Unaffecteds;
            this.unaffectedTree = data.Data.UnaffectedTree;
            // tree binding
            var tree = ($('#UnaffectedTree') as any).fancytree('getTree');
            tree.reload(this.unaffectedTree);
            this.cdr.detectChanges();
        });
    }

    getNode($id) {
        this.query.UnaffectedId = $id;

        this.getData();

        this.getunaffectedChildId($id);
    }
    getUnaffectedDetail($id) {
        this.unaffected = new Unaffected();
        this.unaffectService.GetById({ Id: $id }).subscribe((data: any) => {
            this.unaffected = data.Data;
            this.cdr.detectChanges();
        });
    }

    getunaffectedChildId($id) {
        this.unaffectedChild = new UnaffectedChild();
        this.unaffected = new Unaffected();

        this.unaffectService.GetAllUnaffectedChild({ Id: $id }).subscribe((data: any) => {
            this.unaffectedChild = data.Data;

            this.cdr.detectChanges();
        });
    }
    newUnaffected() {
        this.setViewId(0);

        const dialogRef = this.dialog.originalOpen(CreateUnaffectedComponent, {
            width: '500px',
            data: { viewId: 0 },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    editunaffectedchild(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateUnaffectedComponent, {
            width: '800px',
            data: { viewId: value.Id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData();
        });
    }
    getData() {
        this.isLoading = true;
        this.unaffectService.GetByPage(this.params).subscribe((res: any) => {
            this.list = res.Data.ListObj;
            this.total = res.Data.Pagination.NumberOfRows;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }
    deleteunaffectedchild(value: any) {
        this.unaffectService.Delete({ Id: value.Id }).subscribe((data: any) => {
            this.KeyNodeSelected = this.unaffected.Id;
            this.reloadTree();
            this.getUnaffectedDetail(this.unaffected.Id);
            this.getData();
            this.toastr.success(`Đã xoá ${value.UnaffectChildName}!`);
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

    setViewId(id) {
        this.viewId = id;
    }
}
