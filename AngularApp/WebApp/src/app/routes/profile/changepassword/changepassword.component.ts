import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';

import { ToastrService } from 'ngx-toastr';
import { ChangePasswordService } from './changepassword.service';

import { Staff } from "../../../models/acc/staff";
import { SettingsService, User } from '@core/bootstrap/settings.service';
import { ConfigService } from '@core/bootstrap/config.service';
@Component({
  selector: 'app-changePassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChangePasswordService],
})
export class ChangePasswordComponent implements OnInit {
  isLoading = false;

  staffId: number;

  message: string;
  user: any;
  staff: Staff;
  activeRights: any;

  loadingContent: boolean;
  fileBaseUrl: string;
  listGender: any;

  constructor(private changePasswordService: ChangePasswordService,
    private settings: SettingsService,

    private config: ConfigService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MtxDialog
  ) {
    var conf = this.config.getConfig();
    this.fileBaseUrl = conf.fileBaseUrl;
    this.user = settings.user;
    this.staffId = this.user.Id;
    this.staff = new Staff();
    this.getData();

  }

  ngOnInit() {
  }
  getData() {
    this.changePasswordService.getStaffById({ Id: this.staffId }).subscribe((data: any) => {
      this.staff = data.Data;
      this.listGender = data.Genders;
      if (this.staff.Image == undefined || this.staff.Image == '') {
        this.staff.Image = 'Resources/Images/NoImage.png';
      }
      this.cdr.detectChanges();
    });
  }

  public uploadFinished = (event) => {
    if (event.Success) {
      this.staff.Image = event.Url;
    } else {
      this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
    }

  }
  onSubmitStaffForm(formdata) {
    var postdata = {
      Id: this.staff.Id,
      Password: this.staff.Password,
      NewPassword: this.staff.NewPassword,
      ConfirmPassword: this.staff.ConfirmPassword,
    };

    this.changePasswordService.saveChangePassword(postdata).subscribe((data: any) => {
      this.toastr.success(`Đổi mật khẩu Thành công`);
      this.getData();
    });
  }
}