import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RoleService } from './role.service';
import { PageEvent } from '@angular/material/paginator';

import { Role } from '../../../models/acc/role';
import { DepartmentService } from '../department/department.service';
import { SettingsService, User } from '@core/bootstrap/settings.service';
@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RoleService],
})
export class RoleComponent implements OnInit {
    columns: MtxGridColumn[] = [
        { header: '#ID', field: 'Id', width: '30px' },
        { header: 'Tên Vai Trò', field: 'Name' },
        { header: 'Mô Tả', field: 'Description' },
        {
            header: 'Trạng thái',
            field: 'StatusText',
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
                    click: (record) => this.editRole(record),
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
                    click: (record) => this.deleteRole(record),
                },
            ],
        },
    ];
    list = [];
    total = 0;
    isLoading = false;

    viewId: number;

    message: string;
    user: any;
    role: Role;
    activeRights: any;

    query = {
        q: 'user:nzbin',
        sort: 'stars',
        order: 'desc',
        page: 0,
        per_page: 5,
    };
    loadingContent: boolean;

    nodes: any;
    KeyNodeSelected: number;

    constructor(
        private roleService: RoleService,

        private settings: SettingsService,
        private departmentService: DepartmentService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        public dialog: MtxDialog,
    ) {
        this.user = settings.user;
        this.KeyNodeSelected = this.user.UnitId;
    }

    ngOnInit() {
        this.initDepartmentTree();
    }

    initDepartmentTree() {
        this.loadingContent = true;
        this.departmentService
            .getTreeUnit({ IsLoginUnitOnly: true, IsUnitOnly: true, KeyNodeSelected: this.KeyNodeSelected })
            .subscribe((data: any) => {
                this.nodes = data.Data.Departments;

                this.getData(this.KeyNodeSelected);
                // tree binding
                ($('#DepartementTree') as any).fancytree({
                    source: this.nodes,
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
                        this.getData($id);
                    },
                });

                this.loadingContent = false;

                this.cdr.detectChanges();
            });
    }
    getData($id) {
        this.isLoading = true;
        this.roleService.getall({ UnitId: $id }).subscribe((res: any) => {
            this.list = res.Data.Roles;
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }
    newRole(unitId) {
        this.setViewId(0);

        this.role = new Role();
        this.role.UnitId = unitId;
        const dialogRef = this.dialog.originalOpen(CreateRoleComponent, {
            width: '1000px',
            data: { roleId: 0, unitId: unitId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData(this.KeyNodeSelected);
        });
    }

    setViewId(id) {
        this.viewId = id;
    }
    viewRole(id) {
        this.setViewId(id);
        this.roleService.getbyid({ Id: id }).subscribe((data: any) => {
            this.role = data.Data;
        });
    }
    deleteRole(value: any) {
        this.roleService.deleteRole({ Id: value.Id }).subscribe((data: any) => {
            this.getData(this.KeyNodeSelected);
            this.toastr.success(`Đã xoá ${value.Name}!`);
        });
    }

    editRole(value: any) {
        this.setViewId(value.Id);
        const dialogRef = this.dialog.originalOpen(CreateRoleComponent, {
            width: '1000px',
            data: { roleId: value.Id, unitId: value.UnitId },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') this.getData(this.KeyNodeSelected);
        });
    }
}

@Component({
    selector: 'dialog-role-form',
    styleUrls: ['./dialog-role-form.scss'],
    templateUrl: './dialog-role-form.html',
})
export class CreateRoleComponent {
    role: Role;
    unitId: any;
    roleId: any;
    nodes: any;
    constructor(
        private roleService: RoleService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<CreateRoleComponent>,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.roleId = data.roleId;
        this.unitId = data.unitId;
        this.role = new Role();
        this.getData();
    }

    getData() {
        this.roleService.getbyid({ Id: this.roleId, unitId: this.unitId }).subscribe((data: any) => {
            this.nodes = data.Rights;
            this.role = data.Role;
            ($('#ActionTree') as any).fancytree({
                source: this.nodes,
                minExpandLevel: 1,
                icon: false,
                checkbox: true,
                selectMode: 3,
                beforeExpand: function (event, data) {
                    return true;
                },
                init: function (event, data) {
                    data.tree.getRootNode().visit(function (node) {
                        if (node.data.preselected) node.setSelected(true);
                    });
                },
            });

            this.cdr.detectChanges();
        });
    }

    onClose(): void {
        this.dialogRef.close(0);
    }
    onSubmit(dataRole) {
        var datas = ($('#ActionTree') as any).fancytree('getTree').getSelectedNodes();
        var actions = [];
        for (var i = 0; i < datas.length; i++) {
            var key = parseInt(datas[i].key);
            if (key < 0) {
                actions.push(key * -1);
            }
        }
        var data = {
            Id: this.role.Id,
            UnitId: this.unitId,
            Code: this.role.Code,
            Name: this.role.Name,
            Description: this.role.Description,
            IsLocked: this.role.IsLocked,
            InsertedActions: actions,
        };

        this.roleService.saverole(data).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }
}
