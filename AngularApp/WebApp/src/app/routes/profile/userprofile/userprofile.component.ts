import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MtxGridColumn } from '@ng-matero/extensions';
import { UserProfileService } from './userprofile.service';
import { PageEvent } from '@angular/material/paginator';

import { Staff } from "../../../models/acc/staff";
import { SettingsService, User } from '@core/bootstrap/settings.service';
import { ConfigService } from '@core/bootstrap/config.service';
@Component({
  selector: 'app-userProfile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserProfileService],
})
export class UserProfileComponent implements OnInit {
  isLoading = false;

  staffId: number;

  message: string;
  user: any;
  staff: Staff;
  activeRights: any;

  loadingContent: boolean;
  fileBaseUrl: string;
  listGender: any;

  constructor(private userProfileService: UserProfileService,
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
    this.userProfileService.getStaffById({ Id: this.staffId }).subscribe((data: any) => {
      this.staff = data.Data;
      this.listGender =data.Genders;
      if (this.staff.Image == undefined || this.staff.Image =='')
      {
        this.staff.Image = 'Resources/Images/NoImage.png';
      }
      this.cdr.detectChanges();
    });
  }

  public uploadFinished = (event) => {
    if (event.Success){
      this.staff.Image = event.Url;
     }else  {
      this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
     }
    
  }
  onSubmitStaffForm(formdata) {
    var postdata = {
      Id: this.staff.Id,
      DepartmentId: this.staff.DepartmentId,
      UnitId: this.staff.UnitId,
      Code: this.staff.Code,
      FirstName: this.staff.FirstName,
      LastName: this.staff.LastName,
      Gender: this.staff.Gender,
      UserName: this.staff.UserName,
      Password: this.staff.Password,
      Image: this.staff.Image,
      Email: this.staff.Email,
      Phone: this.staff.Phone,
      Mobile: this.staff.Mobile,
      BirthOfDay: this.staff.BirthOfDay,
      Address: this.staff.Address,
      IDCard: this.staff.IDCard,
      IDCardDate: this.staff.IDCardDate,
      IDCardPlace: this.staff.IDCardPlace,
      IsAdministrator: this.staff.IsAdministrator,
      IsLocked: this.staff.IsLocked,
      CreatedUserId: this.staff.CreatedUserId,
      PositionId: this.staff.PositionId,
      PlaceOfReception: this.staff.PlaceOfReception,
      DossierReturnAddress: this.staff.DossierReturnAddress,
      DepartmentNameReceive: this.staff.DepartmentNameReceive,
      PhoneOfDepartmentReceive: this.staff.PhoneOfDepartmentReceive,
      UnitResolveInformation: this.staff.UnitResolveInformation,
      IsRepresentUnit: this.staff.IsRepresentUnit,
      IsRepresentDepartment: this.staff.IsRepresentDepartment
    };

    this.userProfileService.saveuserProfile(postdata).subscribe((data: any) => {
      this.toastr.success(`Lưu Thông tin cán bộ Thành công`);
      this.getData();
    });
  }
}