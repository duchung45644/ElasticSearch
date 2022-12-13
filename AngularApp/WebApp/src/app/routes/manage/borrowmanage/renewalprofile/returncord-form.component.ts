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
import { Returnrecord } from 'app/models/Returnrecord';

@Component({
  selector: 'dialog-returncord-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-returncord-form.html',
})
export class CreateReturncordComponent {
  returncord: Returnrecord;
  fondList: any;   
  viewId: any;
  apiUrl:string;    
  constructor(
    private renewalprofileService: RenewalprofileService,
    private toastr: ToastrService,

    public dialogRef: MatDialogRef<CreateReturncordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.returncord = new Returnrecord();
   
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.returncord = new Returnrecord();
    if (this.viewId > 0) {
      this.renewalprofileService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.returncord = data.Data;
      });
     
    };
       }
    onSubmit(dataReturnrecord) {
      var data = {
        RegistrasionlistId: this.returncord.RegistrasionlistId,
        Title: this.returncord.Title,
        PaidContent: this.returncord.PaidContent,
      };
      this.renewalprofileService.savereturnrecord(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      }); 
    }
  }

