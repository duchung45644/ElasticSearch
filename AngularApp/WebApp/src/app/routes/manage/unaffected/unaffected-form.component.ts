import { UnaffectedChild } from './../../../models/UnaffectedChild';
import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { UnaffectService } from './unaffected.service';
import { PageEvent } from '@angular/material/paginator';

import { Unaffected} from "../../../models/Unaffected";

@Component({
  selector: 'unaffected-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './unaffected-form.component.html',
})
export class CreateUnaffectedComponent {
    unaffected: Unaffected;
    unaffectedChild:UnaffectedChild;
    unaffectedList: any;
    unaffectedTree: any;
    KeyNodeSelected: number;
  viewId: any;
  newId:any;
  constructor(
    private unaffectService: UnaffectService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateUnaffectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;;
    this.newId=data.newId;
    this.unaffected = new Unaffected();
    this.unaffectedChild= new UnaffectedChild();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    debugger
    this.unaffected = new Unaffected();
    if (this.viewId > 0) {
      this.unaffectService.GetUnaffectedChildById({Id:this.viewId }).subscribe((data: any) => {
        this.unaffectedChild = data.Data;
      });
    };
   this.getTree();
       }
       getTree() {
        this.unaffectService.GetTree({}).subscribe((data: any) => {
          this.unaffectedList = data.Data.Unaffecteds;
          this.unaffectedTree = data.Data.UnaffectedTree;
        });
      }

       onSubmit(dataRight) {
        debugger
          var data = {
            
            Id: this.unaffectedChild.Id,
           
            UnaffectChildName: this.unaffectedChild.UnaffectChildName,
         
            UnaffectedId:this.unaffectedChild.UnaffectedId,
            Code: this.unaffectedChild.Code,
         
            Status: this.unaffectedChild.Status
          
          };
      
          this.unaffectService.Save(data).subscribe((data: any) => {
          
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
            
            this.getData();
           
          
            
           
          });
      
        }

  }

