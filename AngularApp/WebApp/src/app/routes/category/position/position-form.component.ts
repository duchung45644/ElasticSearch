import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { PositionService } from './position.service';
import { PageEvent } from '@angular/material/paginator';

import { Position } from "../../../models/position";
@Component({
  selector: 'dialog-position-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-position-form.html',
})
export class CreatePositionComponent {
  position: Position;
  positionList: any;
  viewId: any;
  constructor(
    private positionService: PositionService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreatePositionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.position = new Position();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.position = new Position();
    if (this.viewId > 0) {
      this.positionService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.position = data.Data;
      });
    };
   
       }


    onSubmit(dataPosition) {

      var data = {
        Id: this.position.Id,
        Code: this.position.Code,
        Name: this.position.Name,
        SortOrder: this.position.SortOrder,
        IsLeader: this.position.IsLeader,
        Description: this.position.Description,
        IsLocked: this.position.IsLocked
      };

      this.positionService.saveposition(data).subscribe((data: any) => {
        this.toastr.success(`Thành công`);
        this.dialogRef.close(1);
      });

    }

  }

