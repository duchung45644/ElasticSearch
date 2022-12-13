import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RightService } from './right.service';
import { PageEvent } from '@angular/material/paginator';

import { Right } from "../../../models/acc/right";
import { Action } from "../../../models/acc/action";
import { CreateRightComponent } from "./right-form.component";

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RightService],
})
export class RightComponent implements OnInit {

  list = [];
  total = 0;
  isLoading = false;

  viewId: number;

  message: string;

  showSearch = false;
  right: Right;
  activeRights: any;

  query = {
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc'
    // thêm đk tìm kiếm
  };
  rightList: any;
  rightTree: any;
  KeyNodeSelected: number;

  constructor(private rightService: RightService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MtxDialog
  ) {
    this.right = new Right();

    this.getRightTree();
  }

  ngOnInit() {
  }
  getRightTree() {
    this.rightService.getRightTree({}).subscribe((data: any) => {
      this.rightList = data.Data.Rights;
      this.rightTree = data.Data.RightTree;
      // tree binding
      ($("#RightTree") as any).fancytree({
        source: this.rightTree,
        minExpandLevel: 1,
        beforeExpand: function (event, data) {
          return true;
        },
        extensions: ["filter"],
        quicksearch: true,
        filter: {
          autoApply: true,   // Re-apply last filter if lazy data is loaded
          autoExpand: false, // Expand all branches that contain matches while filtered
          counter: true,     // Show a badge with number of matching child nodes near parent icons
          fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
          hideExpandedCounter: true,  // Hide counter badge if parent is expanded
          hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
          highlight: true,   // Highlight matches by wrapping inside <mark> tags
          leavesOnly: false, // Match end nodes only
          nodata: true,      // Display a 'no data' status node if result is empty
          mode: "hide"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
        },
        activate: (event, data) => {
          var $id = parseInt(data.node.key);
          this.KeyNodeSelected = $id;
          this.getRightDetail($id);

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

  reloadRightTree() {
    this.rightService.getRightTree({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
      this.rightList = data.Data.Rights;
      this.rightTree = data.Data.RightTree;
      // tree binding
      var tree = ($("#RightTree") as any).fancytree('getTree');
      tree.reload(this.rightTree);
      this.cdr.detectChanges();
    });
  }


  getRightDetail($id) {
 
    this.right = new Right();
    this.rightService.getbyid({ Id: $id }).subscribe((data: any) => {
      this.right = data.Data;
      this.cdr.detectChanges();
    });
  }


  newRight() {
    
    // this.setViewId(0);
    // this.right = new Right();
    // this.right.ListAction = [];

    var newRight = new Right();
    newRight.ParentId = this.right.Id;
    this.right = newRight;
  }

  setViewId(id) {
    this.viewId = id;
  }

  deleteRight(value: any) {

    this.rightService.deleteRight({ Id: value.Id }).subscribe((data: any) => {
      this.KeyNodeSelected = this.right.ParentId;
      this.reloadRightTree();
      this.getRightDetail(this.right.ParentId);
      this.toastr.success(`Đã xoá ${value.Name}!`);
    });

  }

  addAction() {
    var action = new Action();
    if (this.right.ListAction == undefined) this.right.ListAction = [];
    this.right.ListAction.push(action);
  }

  deleteAction($action) {
   
    var idx = this.right.ListAction.indexOf($action);
    this.right.ListAction.splice(idx, 1);
  }
  onSubmit(dataRight) {
    var data = {
      Id: this.right.Id,
      ParentId: this.right.ParentId,
      Name: this.right.Name,
      ShowMenu: true,
      SortOrder: this.right.SortOrder,
      NameOfMenu: this.right.NameOfMenu,
      ActionLink: this.right.ActionLink,
      IsLocked: this.right.IsLocked,
      ListAction:this.right.ListAction
    };

    this.rightService.saveright(data).subscribe((data: any) => {
    
      this.toastr.success(`Thành công`);
      this.KeyNodeSelected = data.ReturnId;
      
      this.reloadRightTree();
      this.getRightDetail( data.ReturnId);
    });

  }

}
