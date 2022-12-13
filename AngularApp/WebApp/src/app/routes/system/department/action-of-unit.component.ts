import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConfigService } from "@core/bootstrap/config.service";

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from "./department.service";

import { Department } from "../../../models/acc/department";
@Component({
    selector: 'action-of-unit-form',
    styles: [
        `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
    templateUrl: './action-of-unit.component.html',
})
export class ActionOfUnitComponent {

    viewId: any;
    loadingContent: boolean;
    department: any;
    rightService: any;
    nodes: any;
    KeyNodeSelected: number;

    constructor(private departmentService: DepartmentService,
        private config: ConfigService,
        private cdr: ChangeDetectorRef,
        public dialog: MtxDialog,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<ActionOfUnitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.viewId = data.viewId;
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loadingContent = true;
        this.departmentService.loadActionOfUnit({ Id: this.viewId }).subscribe((data: any) => {
            this.nodes = data.Data;

            ($("#ActionTree") as any).fancytree({
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
                }
            });

            this.loadingContent = false;

            this.cdr.detectChanges();

        });



    }
    onClose(): void {
        this.dialogRef.close(0);
    }
    onSubmitActionOfUnit(dataRight) {

        var datas = ($("#ActionTree") as any).fancytree('getTree').getSelectedNodes();
        var actions = [];
        for (var i = 0; i < datas.length; i++) {
            var key = parseInt(datas[i].key);
            if (key < 0) {
                actions.push((key * (-1)));
            }
        }
        var data = {
            Id: this.viewId,
            InsertedActions: actions
        };
        this.departmentService.saveActionOfUnit(data).subscribe((data: any) => {
            this.toastr.success(`Giới hạn quyền cho đơn vị Thành công`);
            this.dialogRef.close(1);
        });

    }

}