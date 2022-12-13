import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';


import { ConfigService } from "@core/bootstrap/config.service";

import { ToastrService } from 'ngx-toastr';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';

import { CategoriesService } from "./categories.service";
import { Categories } from "../../../models/Categories";
import { CreateCategoriesComponent } from "./categories-form.component";
import { PageEvent,MatPaginatorIntl } from '@angular/material/paginator';
import { SettingsService } from '@core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// CHÚ Ý
// PHẦN TREE KHÔNG CÓ SCROLL

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CategoriesService],
})
export class CategoriesComponent implements OnInit {

  fileBaseUrl: string;
  loadingContent = false;

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  houseList:any;
  list = [];
  total = 0;
  isLoading = false;
  KeyNodeSelected: any;
  viewId: any;
  isStaff: boolean;
  message: string;
  dataHouse: any;
  showSearch = false;
  categories: Categories;
  query = {

    intCategoriesID: null,
    KeyWord: '',
    PageIndex: 0,
    PageSize: 20,
    SortField: '',
    SortDirection: 'desc'
  };
  dvtList: any;

  get params() {
    const p = Object.assign({}, this.query);
    p.PageIndex += 1;
    return p;
  }
  constructor(private categoriesService: CategoriesService,
    private config: ConfigService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private setting: SettingsService,
    public dialog: MtxDialog
  ) {
    
    this.categories = new Categories();
    this._MatPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 của ${length }`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} của ${length}`;
    };
    var conf = this.config.getConfig();
    this.fileBaseUrl = conf.fileBaseUrl;
    this.query.PageSize = conf.pageSize;

    this.dataSource.data = [];
  }
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.loadingContent = true;
    this.getCategoriesTree();
    this.getAllHouse();
    this.getAllDVT();
    this._MatPaginatorIntl.itemsPerPageLabel = 'Bản.ghi:';
    
  }
  hasAction(code: string) {

    return this.setting.hasAction(code);
  }


  getAllHouse() {
    this.categoriesService.getAllHouse({}).subscribe((data: any) => {
      this.houseList = data.Data.Houses;
    });
  }
  
  getCategoriesTree() {
    if (this.hasAction('1179_VIEW')) {
 
    this.categoriesService.getall({}).subscribe((data: any) => {
      this.dataHouse = data.Data.Houses;
      // tree binding
      ($("#HouseTree") as any).fancytree({
        source: this.dataHouse,
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
          this.getNode($id);
          // this.getHouseDetail($id);
          //console.log(this.dataHouse);
        },
        
      });

      setTimeout(function () {
        // Set key from first part of title (just for this demo output)
        var tree = ($("#HouseTree") as any).fancytree('getTree');
  
        ($("#divTree input[name=search]") as any).keyup(function (e) {
          var n,
            tree = ($("#HouseTree") as any).fancytree('getTree'),
            args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
            opts = { highlight: true, mode: "hide", autoExpand: true },
            filterFunc = tree.filterBranches,
            match = ($(this) as any).val();
  
          // if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
          //   ($("#divTree .btnResetSearch") as any).click();
          //   return;
          // }
          n = filterFunc.call(tree, match, opts);
          //n = filterFunc.call(tree, function (node) {
          //    return new RegExp(match, "i").test(node.title);
          //}, opts);
          ($("#divTree .btnResetSearch") as any).attr("disabled", false);
          ($("#divTree .matches") as any).text("(" + n + " matches)");
        });;//.focus();
  
        ($("#divTree .btnResetSearch") as any).click(function (e) {
          ($("#divTree input[name=search]") as any).val("");
          ($("#divTree .matches") as any).text("");
          tree.clearFilter();
        }).attr("disabled", true);
      }, 200);
    
    });
  } else {

    this.toastr.error(`Tài khoản không có quyền truy cập`);
  }
  
  }

  onKeyUp($event) {
    if ($event.key === 'Escape') {
      this.clearSeachTree();
      return;
    }

    var n,
      tree = ($("#HouseTree") as any).fancytree('getTree'),
      args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
      opts = { highlight: true, mode: "hide", autoExpand: true },
      filterFunc = tree.filterBranches,
      match = $event.target.value;
    n = filterFunc.call(tree, match, opts);
    //n = filterFunc.call(tree, function (node) {
    //    return new RegExp(match, "i").test(node.title);
    //}, opts);
    ($("#divTree .btnResetSearch") as any).attr("disabled", false);
    ($("#divTree .matches") as any).text("(" + n + "  kết quả)");
  }
  clearSeachTree() {
    ($("#divTree input[name=search]") as any).val("");
    ($("#divTree .matches") as any).text("");

    var tree = ($("#DepartementTree") as any).fancytree('getTree');
    tree.clearFilter();
    
  }
  
  reloadCategoriesTree() {
    this.categoriesService.getall({ KeyNodeSelected: this.KeyNodeSelected }).subscribe((data: any) => {
      this.houseList = data.Data.Houses;
      // tree binding
      var tree = ($("#HouseTree") as any).fancytree('getTree');
      tree.reload(this.houseList);
      this.getAllHouse();
      this.cdr.detectChanges();
     
    });
  }
  // getHouseDetail($id) {
  //   this.categories = new Categories();
  //   this.categoriesService.getbyHouseid({ Id: $id }).subscribe((data: any) => {
  //     this.categories = data.Data;
  //     this.cdr.detectChanges();
  //   });
  // }


  newCategories(){
    if (this.hasAction('1179_ADD')) {
   
    this.setViewId(0);
    var newcategories = new Categories();
    newcategories.ParentID = this.categories.intCategoriesID;
    this.categories = newcategories;
    this.getCategoriesTree();
    this.reloadCategoriesTree();
  } else {

    this.toastr.error(`Tài khoản không có quyền truy cập`);
  }
  }
 
  deleteCategories(value: any) {
    if (this.hasAction('1179_DELETE')) {
    this.categoriesService.deleteCategories({ Id: value.intCategoriesID }).subscribe((data: any) => {
      this.KeyNodeSelected = this.categories.ParentID;
      this.reloadCategoriesTree();
     // this.getHouseDetail(this.categories.ParentID);

      this.getNode(this.categories.ParentID);
      this.toastr.success(`Đã xoá loại tài sản ${value.txtCategoriesname}!`);
    });
  } else {

    this.toastr.error(`Tài khoản không có quyền truy cập`);
  }

  }
  getAllDVT(){
    
    this.categoriesService.getAllDVT({}).subscribe((data:any ) => {
      this.dvtList = data.Data.UnitAssetss;
    });
  }
  rowSelectionChangeLog(e: any) {
    console.log(e);
  }

  getNode($id) {
    // console.log($id);
    // this.query.intCategoriesID = $id;
    this.categories = new Categories();
    this.setViewId($id);
    this.categoriesService.getbyHouseid({ Id: $id }).subscribe((data: any) => {
      this.categories = data.Data;
      this.cdr.detectChanges();
    });
    
  };

  setViewId(id) {
    this.viewId = id;
  }

  onSubmit(dataCategories) {
    
    var data = {

      intCategoriesID : this.categories.intCategoriesID,
      txtCategoriesname : this.categories.txtCategoriesname,
      txtCategoriesDesc : this.categories.txtCategoriesDesc,
      Abstract : this.categories.Abstract,
      Measure : this.categories.Measure,
      TimeUsed : this.categories.TimeUsed,
      CateID: this.categories.CateID,
      ParentID : this.categories.ParentID,
      SortOrder: this.categories.SortOrder,
    };

    this.categoriesService.savecategories(data).subscribe((data: any) => {
      
      this.toastr.success(`Thành công`);
      this.KeyNodeSelected = data.ReturnId;
     // this.getHouseDetail( data.ReturnId);
      this.reloadCategoriesTree();
      this.cdr.detectChanges();
     
    });
    this.getAllHouse();
  }

}
