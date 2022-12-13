import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { V2Service } from './v2.service';
import { PageEvent } from '@angular/material/paginator';

// import { V2 } from "../../../models/v2";
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
@Component({
  selector: 'dialog-v2-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
  ],

  templateUrl: './dialog-v2-form.html',
})
export class CreateV2Component {
  //v2: V2;
  v2List: any;
  viewId: any;


  form = new FormGroup({});


  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [

  ];
  allFormInfo: any;
  model: any;
  formJson: any;
  formcode: any;
  title: string;
  constructor(private formlyJsonschema: FormlyJsonschema,
    private formlyService: DynamicFormService,

    private cdr: ChangeDetectorRef,
    private v2Service: V2Service,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.viewId = data.viewId;
    this.formcode = data.formcode;
    this.formJson = data.formJson;
    this.model = {};

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
          switch (this.formcode) {
            case "PUBLICSECTOR":
              {

                if (f.key == 'ParentId') {
                  f.type = 'combobox';
                  this.v2Service.publicsector_getall({}).subscribe((data: any) => {
                    f.templateOptions.options = data.Data.Publicsectors;
                  });
                }
              }
              break;

              case "PROCEDURE":
                {
  
                  if (f.key == 'PublicSectorId') {
                    f.type = 'combobox';
                    this.v2Service.publicsector_getall({}).subscribe((data: any) => {
                      f.templateOptions.options = data.Data.Publicsectors;
                    });
                  }
                }
                break;
            default:
              break;
          }

        }

      return g;
    });
  }
  getFormJson(formobj) {
    let obj = JSON.parse(formobj.FormJson);
    this.allFormInfo = obj;
    //  this.form = new FormGroup({});
    //this.model = model;
    var fields = this.mapFields(obj.schema.fields);

    this.fields = fields;

    // this.form = new FormGroup({});
    // this.options = {};
    // this.fields = [this.formlyJsonschema.toFieldConfig(obj.schema)];
    this.model = obj.model;
  }
  getData() {
    this.model = {};
    if (this.viewId > 0) {
      switch (this.formcode) {
        case "PUBLICSECTOR":
          {
            this.v2Service.publicsector_getbyid({ Id: this.viewId }).subscribe((data: any) => {
              this.model = data.Data;
            });
          }
          break;
          case "PROCEDURE":
            {
              this.v2Service.procedure_GetById({ Id: this.viewId }).subscribe((data: any) => {
                this.model = data.Data;
              });
            }
            break;

        default:
          break;
      }
    };

    if (this.viewId>0) {
      this.title = this.allFormInfo.schema.edittitle;
    } else { this.title = this.allFormInfo.schema.createtitle; }
  }

  submit() {
    if (this.form.valid) {
      this.v2Service.publicsector_save(this.model).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close({ code: 1 });
      });
    }
  }

}

