import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { RenewalprofileService } from './renewalprofile.service';
import { PageEvent } from '@angular/material/paginator';
import { Registrasionlist } from 'app/models/Registrasionlist';
import { Returnrecord } from 'app/models/Returnrecord';

@Component({
  selector: 'dialog-request-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-request-form.html',
})
export class CreateRequestComponent {
  request: Returnrecord;   
  viewId: any;
  apiUrl:string;    
  constructor(
    private renewalprofileService: RenewalprofileService,
    private toastr: ToastrService,

    public dialogRef: MatDialogRef<CreateRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.request = new Returnrecord();
   
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.request = new Returnrecord();
    if (this.viewId > 0) {
      this.renewalprofileService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.request = data.Data;
      });
     
    };
       }
    onSubmit(dataRequest) {
      var data = {
        RegistrasionlistId: this.request.RegistrasionlistId,
        Title: this.request.Title,
        CancelContent: this.request.CancelContent,
      };
      this.renewalprofileService.saverequest(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      }); 
    }
  }

