import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { DynamicFormService } from './dynamic-form.service';
import { Formly } from 'app/models/Formly';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { Category } from 'app/models/category';
import { CreateCategoryComponent } from '../category/category-form.component';
import { CategoryService } from '../category/category.service';
@Component({
  selector: 'view-dynamic-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
  ],
  templateUrl: './view-dynamic-form.html',
})
export class ViewDynamicFormComponent {
  //category: Category;
  categoryList: any;
  viewId: any;


  form = new FormGroup({});


  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [

  ];
  model: any;
  code: any;
  formobj: any;
  constructor(private formlyJsonschema: FormlyJsonschema,
    private formlyService: DynamicFormService,

    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    
    this.formobj = data.formobj; 
    this.code = data.formobj.FormCode;
    this.getFormJson(this.formobj);
  }

  ngOnInit() {
    this.getData();
  }

  getFormJson(formobj) {

    let obj = JSON.parse(formobj.FormJson);

    this.form = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(obj.schema)];
    this.model = obj.model;
  }
  getData() {
     
  }

  submit() {
    this.toastr.success(`Thành công`);
    
  } 

}

