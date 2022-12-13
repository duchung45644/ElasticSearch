import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConfigService } from '@core/bootstrap/config.service';

import { ToastrService } from 'ngx-toastr';
import { MtxDialog } from '@ng-matero/extensions/dialog';

import { MtxGridColumn } from '@ng-matero/extensions';

import { DepartmentService } from './department.service';
import { Department } from '../../../models/acc/department';
import { Staff } from '../../../models/acc/staff';
import { PageEvent } from '@angular/material/paginator';
import { ActionOfUnitComponent } from './action-of-unit.component';
import { RoleOfStaffComponent } from './role-of-staff.component';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DepartmentService],
})
export class DepartmentComponent implements OnInit, AfterViewInit {
    fileBaseUrl: string;
    loadingContent = false;
    nodes: any;
    options = {};
    list = [];
    total = 0;
    isLoading = false;
    viewId: string;
    KeyNodeSelected: any;
    isStaff: boolean;
    department: Department;
    staff: Staff;
    listParent: any;
    message: string;
    showSearch = false;
    query = {
        intDepartmentID: null,
        KeyWord: '',
        PageIndex: 0,
        PageSize: 20,
        SortField: '',
        SortDirection: 'desc',
    };
    listPosition: any;
    listGender: any;
    listLevel: any;
    defaultPassword: any;
    roles: any;
    user: any;

    get params() {
        const p = Object.assign({}, this.query);
        p.PageIndex += 1;
        return p;
    }
    constructor(
        private departmentService: DepartmentService,
        private config: ConfigService,
        private settings: SettingsService,
        private cdr: ChangeDetectorRef,
        public dialog: MtxDialog,
        private toastr: ToastrService,
    ) {
        var conf = this.config.getConfig();
        this.fileBaseUrl = conf.fileBaseUrl;
        this.query.PageSize = conf.pageSize;
        this.isStaff = false;
        this.department = new Department();
        this.staff = new Staff();
        this.nodes = [];
        this.user = settings.user;
        this.KeyNodeSelected = this.user.UnitId;
    }
    ngOnInit() {
        this.initDepartmentTree();
    }

    ngAfterViewInit() {}
    initDepartmentTree() {
        this.loadingContent = true;
        this.departmentService
            .Init({ IsLoginUnitOnly: true, IsUnitOnly: true, KeyNodeSelected: this.KeyNodeSelected })
            .subscribe((data: any) => {
                this.nodes = data.Data.Departments;
                this.listParent = data.Data.Parents;
                this.listPosition = data.Data.Positions;
                this.listGender = data.Data.Genders;
                this.listLevel = data.Data.Levels;
                this.defaultPassword = data.Data.DefaultPassword;

                this.isStaff = false;

                this.getDepartmentDetail(this.KeyNodeSelected);

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

                        this.isStaff = $id < 0 ? true : false;
                        if ($id < 0) {
                            this.getStaffDetail($id * -1);
                        } else {
                            this.getDepartmentDetail($id);
                        }
                    },
                });

                this.loadingContent = false;

                this.cdr.detectChanges();
            });
    }
    onKeyUp($event) {
        if ($event.key === 'Escape') {
            this.clearSeachTree();
            return;
        }

        var n,
            tree = ($('#DepartementTree') as any).fancytree('getTree'),
            args = 'autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata'.split(' '),
            opts = { highlight: true, mode: 'hide', autoExpand: true },
            filterFunc = tree.filterBranches,
            match = $event.target.value;
        n = filterFunc.call(tree, match, opts);
        //n = filterFunc.call(tree, function (node) {
        //    return new RegExp(match, "i").test(node.title);
        //}, opts);
        ($('#divTree .btnResetSearch') as any).attr('disabled', false);
        ($('#divTree .matches') as any).text('(' + n + '  kết quả)');
    }
    clearSeachTree() {
        ($('#divTree input[name=search]') as any).val('');
        ($('#divTree .matches') as any).text('');

        var tree = ($('#DepartementTree') as any).fancytree('getTree');
        tree.clearFilter();
    }

    reloadDepartmentTree() {
        this.loadingContent = true;
        this.departmentService
            .Init({ IsLoginUnitOnly: true, IsUnitOnly: true, KeyNodeSelected: this.KeyNodeSelected })
            .subscribe((data: any) => {
                this.nodes = data.Data.Departments;

                // tree binding
                var tree = ($('#DepartementTree') as any).fancytree('getTree');
                this.nodes = data.Data.Departments;
                tree.reload(this.nodes);

                this.loadingContent = false;

                this.cdr.detectChanges();
            });
    }

    getDepartmentDetail($id) {
        this.isStaff = false;
        this.department = new Department();
        this.staff = new Staff();
        this.loadingContent = true;
        this.departmentService.getDepartmentById({ Id: $id }).subscribe((data: any) => {
            this.department = data.Data;

            this.loadingContent = false;

            this.cdr.detectChanges();
        });
    }
    loadActionOfUnit($id) {
        const dialogRef = this.dialog.originalOpen(ActionOfUnitComponent, {
            width: '500px',
            data: { viewId: $id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') {
            }
        });
    }
    loadRoleOfStaff($id) {
        const dialogRef = this.dialog.originalOpen(RoleOfStaffComponent, {
            width: '800px',
            data: { viewId: $id },
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            if (result == '1') {
            }
        });
    }

    getStaffDetail($id) {
        this.isStaff = true;
        this.staff = new Staff();
        this.department = new Department();
        this.loadingContent = true;
        this.departmentService.getStaffById({ Id: $id }).subscribe((data: any) => {
            this.staff = data.Data;
            if (this.staff.Image == undefined || this.staff.Image == '') {
                this.staff.Image = 'Resources/Images/NoImage.png';
            }
            this.roles = data.Roles;
            this.loadingContent = false;
            this.cdr.detectChanges();
        });
    }
    newDepartment() {
        this.isStaff = false;
        var newDep = new Department();
        newDep.ParentId = this.department.Id;
        newDep.Level = this.department.Level + 1;
        this.department = newDep;
    }

    newStaff() {
        this.isStaff = true;
        var newStaff = new Staff();
        newStaff.Password = this.defaultPassword;
        newStaff.UnitId = this.department.Id;
        newStaff.DepartmentId = this.department.Id;
        this.staff = newStaff;
        if (this.staff.Image == undefined || this.staff.Image == '') {
            this.staff.Image = 'Resources/Images/NoImage.png';
        }
    }

    deleteUnit($id) {
        this.dialog.confirm(
            `Bạn có chắc chắn muốn xóa phòng ban/đơn vị: ${this.department.Name}?`,

            () => {
                this.loadingContent = true;
                this.departmentService.deleteDepartment({ Id: $id }).subscribe((data: any) => {
                    this.KeyNodeSelected = this.department.ParentId;
                    this.isStaff = false;
                    this.getDepartmentDetail(this.department.ParentId);
                    this.department = new Department();
                    this.loadingContent = false;
                    this.reloadDepartmentTree();
                    this.cdr.detectChanges();
                });
            },
            () => {},
        );
    }

    deleteStaff($id) {
        this.dialog.confirm(
            `Bạn có chắc chắn muốn xóa cán bộ: ${this.staff.FirstName} ${this.staff.LastName}?`,

            () => {
                this.loadingContent = true;
                this.departmentService.deleteStaff({ Id: $id }).subscribe((data: any) => {
                    this.KeyNodeSelected = this.staff.DepartmentId;
                    this.isStaff = false;
                    this.getDepartmentDetail(this.staff.DepartmentId);
                    this.staff = new Staff();

                    this.loadingContent = false;
                    this.reloadDepartmentTree();
                    this.cdr.detectChanges();
                });
            },
            () => {},
        );
    }

    resetPasswordStaff($id) {
        this.dialog.confirm(
            `Bạn có chắc chắn muốn đặt lại mật khẩu ${this.defaultPassword} cho cán bộ : ${this.staff.FirstName} ${this.staff.LastName}?`,

            () => {
                this.loadingContent = true;
                this.departmentService.resetPasswordStaff({ Id: $id }).subscribe((data: any) => {
                    this.toastr.success(`Đặt lại mật khẩu  Thành công`);
                });
            },
            () => {},
        );
    }
    onSubmitDepartmentForm(formdata) {
        var postdata = {
            Id: this.department.Id,
            Code: this.department.Code,
            Password: this.department.Password,
            DocCode: this.department.DocCode,
            ConsummerKey: this.department.ConsummerKey,
            ConsummerSecret: this.department.ConsummerSecret,
            AbbName: this.department.AbbName,
            ShortName: this.department.ShortName,
            Name: this.department.Name,
            ParentId: this.department.ParentId,
            IsUnit: this.department.IsUnit,
            SortOrder: this.department.SortOrder,
            AllowDocBook: this.department.AllowDocBook,
            Level: this.department.Level,
            Description: this.department.Description,
            IsLocked: this.department.IsLocked,
            CreatedUserId: this.department.CreatedUserId,
        };

        this.departmentService.saveDepartment(postdata).subscribe((data: any) => {
            this.toastr.success(`Lưu Phòng ban/đơn vị Thành công`);
            this.reloadDepartmentTree();
        });
    }

    public uploadFinished = (event) => {
        if (event.Success) {
            this.staff.Image = event.Url;
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };

    onSubmitStaffForm(formdata) {
        var postdata = {
            Id: this.staff.Id,
            DepartmentId: this.staff.DepartmentId,
            UnitId: this.staff.UnitId,
            Code: this.staff.Code,
            FirstName: this.staff.FirstName,
            LastName: this.staff.LastName,
            Gender: this.staff.Gender,
            UserName: this.staff.UserName,
            Password: this.staff.Password,
            Image: this.staff.Image,
            Email: this.staff.Email,
            Phone: this.staff.Phone,
            Mobile: this.staff.Mobile,
            BirthOfDay: this.staff.BirthOfDay,
            Address: this.staff.Address,
            IDCard: this.staff.IDCard,
            IDCardDate: this.staff.IDCardDate,
            IDCardPlace: this.staff.IDCardPlace,
            IsAdministrator: this.staff.IsAdministrator,
            IsLocked: this.staff.IsLocked,
            CreatedUserId: this.staff.CreatedUserId,
            PositionId: this.staff.PositionId,
            PlaceOfReception: this.staff.PlaceOfReception,
            DossierReturnAddress: this.staff.DossierReturnAddress,
            DepartmentNameReceive: this.staff.DepartmentNameReceive,
            PhoneOfDepartmentReceive: this.staff.PhoneOfDepartmentReceive,
            UnitResolveInformation: this.staff.UnitResolveInformation,
            IsRepresentUnit: this.staff.IsRepresentUnit,
            IsRepresentDepartment: this.staff.IsRepresentDepartment,
        };

        this.departmentService.saveStaff(postdata).subscribe((data: any) => {
            this.toastr.success(`Lưu Thông tin cán bộ Thành công`);
            this.reloadDepartmentTree();
        });
    }
}
