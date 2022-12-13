import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { RecordService } from './record.service';

import { Record } from "../../../models/Record";
import { ConfigService } from '@core/bootstrap/config.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-records-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RecordService],
})

export class CreateRecordComponent {
  record: Record;
  RecordList: any;
  provinceList: any;

  viewId: any;
  fileBaseUrl: string;
  fondList: any;
  sub: any;
  categoryList: any;
  warehouseList: any;
  UnitId: any;
  StaffList: any;
  shelfList: any;
  BoxList: any;
  ConditionList: any;
  FieldList: any;
  languageList: any;
  maintenanceList: any;
  rightsList: any;

  constructor(
    private RecordService: RecordService,
    private toastr: ToastrService,
    private config: ConfigService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,

  ) {
    this.record = new Record();
    var conf = this.config.getConfig();
    this.fileBaseUrl = conf.fileBaseUrl;
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.viewId = params['id'];
      this.getData();
    });
  }

  ngOnInit() {
    this.getData();
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getData() {
    this.GetAllFond();
    this.getallfield();
    this.getallWarehouse();
    this.StaffGetByUnit();
    this.GetAllCondition();
    this.getallLanguage();
    this.getallRights();
    this.getallMaintenance();
  }

  FileCatalogChange($event, $FileNotation) {
    if ($event == undefined || $FileNotation == undefined) {
      this.record.FileCode = '';
    } else {
        this.getnewFileCode($event, $FileNotation);
    }
  }

  FileNotationChange($FileCatalog, $event) {
    if ($event == undefined || $FileCatalog == undefined) {
      this.record.FileCode = '';
    } else {
      this.getnewFileCode($FileCatalog,$event);
    }
  }

  GetAllCondition(){
    this.RecordService.getallcondition({}).subscribe((data: any) => {
      this.ConditionList = data.Data.Conditions;
    });
  }

  GetAllFond() {
    this.RecordService.getallFond({}).subscribe((data: any) => {
      this.fondList = data.Data;
    });
  }

  getnewFileCode($FileCatalog, $FileNotation) {
    this.RecordService.getFileCodeByDeparment({ FileCatalog: $FileCatalog, FileNotation: $FileNotation }).subscribe((data: any) => {
      this.record.FileCode = data.Data.FileCode;
      this.cdr.detectChanges();
    });
  }

  StaffGetByUnit(){
    this.RecordService.getStaffGetByUnit({}).subscribe((data: any) => {
      this.StaffList = data.Data;
    });
  }

  getallWarehouse() {
    this.RecordService.getallWarehouse({}).subscribe((data: any) => {
      this.warehouseList = data.Data.Warehouses;
    });
  }

  getShelftByWarehouse($event){
    if(this.record.WareHouseId > 0){
      this.RecordService.getShelfByWareHouse({Id:this.record.WareHouseId}).subscribe((data: any) => {
        this.shelfList = data.Data;
      });
    }else{
      this.shelfList = [];
    }  
  }

  getBoxByShelf($event){
    if(this.record.ShelfId > 0){
      this.RecordService.getBoxbyShelft({Id:this.record.ShelfId}).subscribe((data: any) => {
        this.BoxList = data.Data;
      });
    }else{
      this.BoxList = [];
    }  
  }

  getallfield(){
    this.RecordService.getallfield({}).subscribe((data: any) => {
      this.FieldList = data.Data.Fieldss;
    });
  }

  public uploadFinished = (event) => {
    if (event.Success) {
      this.record.Maintenance = event.Url;
    } else {
      this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
    }
  }

  getallLanguage(){
    this.RecordService.getallLanguage({}).subscribe((data: any) => {
        this.languageList = data.Data;
    });
  }
  
  getallRights(){
    this.RecordService.getAllRights({}).subscribe((data: any) => {
        this.rightsList = data.Data;
    });
  }

  getallMaintenance(){
    this.RecordService.getAllMaintenance({}).subscribe((data: any) => {
        this.maintenanceList = data.Data;
    });
  }

  CompareDate(){
    if(this.record.StartDate > this.record.CompleteDate){
      this.toastr.error("Thời gian bắt đầu phải lớn hơn thời gian kết thúc!");
    }
  }

  onSubmit(dataRecord) {
    
    var data = {
      Id: this.record.Id,
      UnitId: this.record.UnitId,
      FondId: this.record.FondId,
      FileCode: this.record.FileCode,
      FileCatalog: this.record.FileCatalog,
      FileNotation: this.record.FileNotation,
      Title: this.record.Title,
      Maintenance: this.record.Maintenance,
      Rights: this.record.Rights,
      Language: this.record.Language,
      RecordContent: this.record.RecordContent,
      StartDate: this.record.StartDate,
      CompleteDate: this.record.CompleteDate,
      TotalDoc: this.record.TotalDoc,
      Description: this.record.Description,
      InforSign: this.record.InforSign,
      Keyword: this.record.Keyword,
      TotalPaper: this.record.TotalPaper,
      PageNumber: this.record.PageNumber,
      Format: this.record.Format,
      ArchiveDate: this.record.ArchiveDate,
      ReceptionArchiveId: this.record.ReceptionArchiveId,
      InChargeStaffId: this.record.InChargeStaffId,
      WareHouseId: this.record.WareHouseId,
      ShelfId: this.record.ShelfId,
      BoxId: this.record.BoxId,
      ReceptionDate: this.record.ReceptionDate,
      ReceptionFrom: this.record.ReceptionFrom,
      TransferStaff: this.record.TransferStaff,
      IsDocumentOriginal: this.record.IsDocumentOriginal,
      NumberOfCopy: this.record.NumberOfCopy,
      DocFileId: this.record.DocFileId,
      Number: this.record.Number,
      TransferOnlineStatus: this.record.TransferOnlineStatus,
      OtherType: this.record.OtherType,
      Version: this.record.Version,
    };



    this.RecordService.saveRecord(data).subscribe((data: any) => {
      this.toastr.success(`Thành công`);
      // this.dialogRef.close(1);

      this.router.navigate(['/manage/record']);
    });



  }

}