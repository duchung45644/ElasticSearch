import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { LogbookborrowedService } from './logbookborrowed.service';
import { PageEvent } from '@angular/material/paginator';

import { Docofrequest } from 'app/models/Docofrequest';

@Component({
  selector: 'dialog-logbookborrowed-form',
  styles: [
    `
        .demo-full-width {
          width: 100%;
        }
      `,
    ],
  
  templateUrl: './dialog-logbookborrowed-form.html',
})
export class CreateLogbookborrowedComponent {
    logbookborrowed: Docofrequest;
  fondList: any;
  viewId: any;
  constructor(
    private logbookborrowedService: LogbookborrowedService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateLogbookborrowedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewId = data.viewId;
    this.logbookborrowed = new Docofrequest();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.logbookborrowed = new Docofrequest();
    if (this.viewId > 0) {
      this.logbookborrowedService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
        this.logbookborrowed = data.Data;
      });
    };
       }
    onSubmit(dataLogbookborrowed) {

      var data = {
        Id: this.logbookborrowed.Id,
            ReceiveDate: this.logbookborrowed.ReceiveDate,
            BorrowType: this.logbookborrowed.BorrowDate,
            ReceiverName: this.logbookborrowed.ReceiverName,
            AppointmentDate: this.logbookborrowed.ReceiveDate,
            ReimburseDate: this.logbookborrowed.BorrowDate,
            Status: this.logbookborrowed.Status,
      };    

    }

  }

