import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { CategoryService } from './category.service';
import { PageEvent } from '@angular/material/paginator';

import { Category } from "../../../models/category";
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
@Component({
  selector: 'dialog-category-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
  ],

  templateUrl: './dialog-category-form.html',
})
export class CreateCategoryComponent {
  //category: Category;
  categoryList: any;
  viewId: any;


  form = new FormGroup({});


  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [

  ];
  model: any;
  formJson: any;
  code: any;
  title: string;
  allFormInfo: any;
  constructor(private formlyJsonschema: FormlyJsonschema,
    private formlyService: DynamicFormService,

    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    debugger;
    this.viewId = data.viewId;
    this.code = data.code;
    this.formJson = data.formJson;
    this.model = new Category();

    this.getFormJson(this.formJson)
  }

  ngOnInit() {
    this.getData();
  }
  mapFields(fields: FormlyFieldConfig[]) {
    return fields.map(g => {
      if (g.fieldGroup != undefined)
        for (let index = 0; index < g.fieldGroup.length; index++) {
          const f = g.fieldGroup[index];
          if (f.key == 'PublicSectorId') {
            f.type = 'combobox';
            this.formlyService.getAllPublicSector({}).subscribe((data: any) => {
              f.templateOptions.options = data.Data.Publicsectors;
            });
          }
        }


      return g;
    });
  }
  getFormJson(formobj) {
    let obj = JSON.parse(formobj.FormJson);

    //  this.form = new FormGroup({});
    //this.model = model;
    this.allFormInfo = obj;
    var fields = this.mapFields(obj.schema.fields);

    this.fields = fields;

    // this.form = new FormGroup({});
    // this.options = {};
    // this.fields = [this.formlyJsonschema.toFieldConfig(obj.schema)];
    this.model = obj.model;

  }
  getData() {
    this.model = new Category();
    if (this.viewId > 0) {
      this.categoryService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.model = data.Data;
      });
    };

    if (this.viewId>0) {
      this.title = this.allFormInfo.schema.edittitle;
    } else { this.title = this.allFormInfo.schema.createtitle; }
  }

  submit() {
    if (this.form.valid) {
      this.model.code = this.code;
      this.categoryService.save(this.model).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close({ code: 1 });
      });
    }
  }

}

