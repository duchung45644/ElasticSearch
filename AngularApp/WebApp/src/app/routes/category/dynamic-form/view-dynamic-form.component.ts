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
  styleUrls: ['./dynamic-form.component.scss'],
  templateUrl: './view-dynamic-form.html',
})
export class ViewDynamicFormComponent {
  form = new FormGroup({});

  options: FormlyFormOptions = {};
  model: any;
  fields: FormlyFieldConfig[];
  // FormlyFieldConfig[] = [
  //   {
  //     fieldGroupClassName: 'row',
  //     fieldGroup: [
  //       {
  //         className: 'col-sm-6',
  //         type: 'input',
  //         key: 'firstName',
  //         templateOptions: {
  //           label: 'First Name',
  //           required: true,
  //         },
  //       },
  //       {
  //         className: 'col-sm-6',
  //         type: 'input',
  //         key: 'lastName',
  //         templateOptions: {
  //           label: 'Last Name',
  //           required: true,
  //         },
  //         expressionProperties: {
  //           'templateOptions.disabled': '!model.firstName',
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     fieldGroupClassName: 'row',
  //     fieldGroup: [
  //       {
  //         className: 'col-sm-6',
  //         type: 'input',
  //         key: 'street',
  //         templateOptions: {
  //           label: 'Street',
  //         },
  //       },
  //       {
  //         className: 'col-sm-3',
  //         type: 'combobox',
  //         key: 'cityId',
  //         templateOptions: {
  //           label: 'City',
  //           options: [
  //             { id: 1, name: '北京' },
  //             { id: 2, name: '上海' },
  //             { id: 3, name: '广州' },
  //             { id: 4, name: '深圳' },
  //           ],
  //           labelProp: 'name',
  //           valueProp: 'id',
  //           required: true,
  //           description: 'This is a custom field type.',
  //         },
  //       },
  //       {
  //         className: 'col-sm-3',
  //         type: 'input',
  //         key: 'zip',
  //         templateOptions: {
  //           type: 'number',
  //           label: 'Zip',
  //           max: 99999,
  //           min: 0,
  //           pattern: '\\d{5}',
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     type: 'textarea',
  //     key: 'otherInput',
  //     templateOptions: {
  //       label: 'Other Input',
  //     },
  //   },
  //   {
  //     type: 'checkbox',
  //     key: 'otherToo',
  //     templateOptions: {
  //       label: 'Other Checkbox',
  //     },
  //   },
  // ];

  //FormlyFieldConfig[];

  code: any;
  formobj: any;
  title: any;
  allFormInfo: any;
  constructor(private formlyJsonschema: FormlyJsonschema,
    private formlyService: DynamicFormService,

    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.formobj = data.formobj;
    this.code = data.formobj.FormCode;
    this.getFormJson(this.formobj);
  }

  ngOnInit() {
    this.getData();
  }
  /**
     * Adjust the JSON fields loaded from the server.
     */
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
    try {
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
    } catch (error) {
      alert(error);
      this.dialogRef.close({ code: 0 });
    }


  }
  getData() {
    if (this.model.Id) {
      this.title = this.allFormInfo.schema.edittitle;
    } else { this.title = this.allFormInfo.schema.createtitle; }
  }
  public uploadFinished = (event) => {

    // this.showImportError =false
    // this.listError = [];
    if (event.Success) {
      // this.listAssets = event.Assets;
      // this.dialog.alert('Import thành công.')
      this.toastr.success(`Thành công`);



    } else {
      this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
      // if (event.DataError != undefined) {
      //   this.showImportError = true;
      //   this.listError = event.DataError;

      // }

    }

  }

  submit() {
    this.toastr.success(`Thành công`);
    alert(JSON.stringify(this.model));
  }

}

