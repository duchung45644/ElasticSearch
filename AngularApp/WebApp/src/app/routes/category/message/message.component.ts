import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';


import { ConfigService } from "@core/bootstrap/config.service";

import { ToastrService } from 'ngx-toastr';

import { MtxGridColumn } from '@ng-matero/extensions'; 
// begin tree
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { TreeviewItem } from 'ngx-treeview';
import { TreeviewConfig, DropdownTreeviewComponent } from 'ngx-treeview';
/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
const TREE_DATA= [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables Vegetables Vegetables Vegetables Vegetables ',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];
// end tree
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class MessagecontentComponent implements OnInit {
  information: Information;


  cols: any[];
  fileBaseUrl: string;
  loadingContent = false;

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '300',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  items: TreeviewItem[];
  _treeViewItem:any;

  constructor(
    private config: ConfigService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    var conf = this.config.getConfig();
    this.fileBaseUrl = conf.fileBaseUrl;
    this.information = new Information();

    this.dataSource.data = [];
  }
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit() {
    
    this.information.Description ='dfsfsd';
    this.loadingContent = true;
    this.loadingContent = false;
    this.cdr.detectChanges();
// this.getFamcateTree();

// this.items = this.getBooks();

this._treeViewItem = this.getBooks();
// this._treeViewItem.children.push(new TreeviewItem({ text: 'Mushroom', value: 23, checked: false}));
// this._treeViewItem.correctChecked();

  }

 getFamcateTree (){
   
 }

 getNode(node:any){
console.log(node);
 }
  public uploadFinished = (event) => {
    if (event.Success) {
      this.toastr.success(`Thành công ${event.Url}`);
      this.information.ImageUrl = event.Url;
    } else {
      this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
    }

  }

  getExpiredDateString(v: string) {
    console.log(v);
    this.information.ExpiredDateStr = v;
  }

  onSubmit(dataForm) {
    this.loadingContent = true;
    this.toastr.success(`Thành công`);
   console.log(dataForm);
   console.log(this.information);
   console.log(new Date(dataForm.ExpiredDate));
    this.loadingContent = false;
    this.cdr.detectChanges();
  }



  onSelectedChange(selectedCities: any): void {
    console.log(selectedCities);
  }

  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
        text: 'Children', value: 1, collapsed: true, children: [
            { text: 'Baby 3-5', value: 11 },
            { text: 'Baby 6-8', value: 12 },
            { text: 'Baby 9-12', value: 13 }
        ]
    });
    const itCategory = new TreeviewItem({
        text: 'IT', value: 9, children: [
            {
                text: 'Programming', value: 91, children: [{
                    text: 'Frontend', value: 911, children: [
                        { text: 'Angular 1', value: 9111 },
                        { text: 'Angular 2', value: 9112 },
                        { text: 'ReactJS', value: 9113, disabled: true }
                    ]
                }, {
                    text: 'Backend', value: 912, children: [
                        { text: 'C#', value: 9121 },
                        { text: 'Java', value: 9122 },
                        { text: 'Python', value: 9123, checked: false, disabled: true }
                    ]
                }]
            },
            {
                text: 'Networking', value: 92, children: [
                    { text: 'Internet', value: 921 },
                    { text: 'Security', value: 922 }
                ]
            }
        ]
    });
    const teenCategory = new TreeviewItem({
        text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
            { text: 'Adventure', value: 21 },
            { text: 'Science', value: 22 }
        ]
    });
    const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
    return [childrenCategory, itCategory, teenCategory, othersCategory];
}


}


export  class Information 
{
  public InformationId : number;
  public Title : string;
  public Description : string;
  public CreatedDate : Date;
  public IsDeleted : boolean;
  public ImageUrl : string;
  public ExpiredDate : any;

  public ExpiredDateStr : string;
}

