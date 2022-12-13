import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentArchiveService } from './documentarchive.service';
import { ConfigService } from '@core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'view-documentarchive',
    templateUrl: './view-documentarchive.component.html',
    styleUrls: ['./documentarchive.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DocumentArchiveService],
})
export class ViewDocumentArchiveComponent {
    fileBaseUrl: any;
    documentArchive: DocumentArchive;
    ConditionList: any;
    languageList: any;
    RecordId: any;
    catalogList: any;
    viewId: any;
    url: any;
    import: any;
    FileName: any;
    urldownload: any;

    constructor(
        private documentArchiveService: DocumentArchiveService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        public datePipe: DatePipe,
        private dialogRef: MatDialogRef<ViewDocumentArchiveComponent>,
        private config: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.documentArchive = new DocumentArchive();
        this.RecordId = data.viewId;
        this.viewId = data.value;
        var conf = this.config.getConfig();
        this.fileBaseUrl = conf.fileBaseUrl;
        this.import = {
            Url: 'upload/UploadFile',
        };
    }

    ngOnInit() {
        this.GetAllCondition();
        this.getallLanguage();
        this.getallcatalog();
        this.getData();
        if (this.url == undefined || this.url == null) {
            this.url = '';
        }
    }

    View = (att) => {
        var extension = att.FilePath.split('.');
        if (extension[1] == 'pdf') {
            this.url = this.fileBaseUrl + att.FilePath;
        } else {
            this.toastr.error('Tệp tin không thể mở!');
        }
    };

    removeAttachmentDossiers = (att) => {
        const index: number = this.documentArchive.attachmentOfDocumentArchives.indexOf(att);
        if (index !== -1) {
            this.documentArchive.attachmentOfDocumentArchives.splice(index, 1);
        }
    };

    public uploadFinished = (event) => {
        if (event.Success) {
            if (this.documentArchive.attachmentOfDocumentArchives == undefined) {
                this.documentArchive.attachmentOfDocumentArchives = [];
            }
            this.documentArchive.attachmentOfDocumentArchives.push({
                FileName: event.Name,
                FilePath: event.Url,
            });
        } else {
            this.toastr.error(`Có lỗi xảy ra: ${event.Message}`);
        }
    };

    getData() {
        this.documentArchive = new DocumentArchive();
        if (this.viewId != 0) {
            this.documentArchiveService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.documentArchive = data.Data;
                this.cdr.detectChanges();
            });
        }
    }

    GetAllCondition() {
        this.documentArchiveService.getallcondition({}).subscribe((data: any) => {
            this.ConditionList = data.Data.Conditions;
        });
    }

    getallLanguage() {
        this.documentArchiveService.getallLanguage({}).subscribe((data: any) => {
            this.languageList = data.Data;
        });
    }

    getallcatalog() {
        this.documentArchiveService.getallcatalog({}).subscribe((data: any) => {
            this.catalogList = data.Data.Catalogs;
        });
    }

    close() {
        this.dialogRef.close(1);
    }
    onSubmit(dataDocumentArchive) {
        var datasend = {
            Id: this.documentArchive.Id,
            DocCode: this.documentArchive.DocCode,
            Abstract: this.documentArchive.Abstract,
            DocOrdinal: this.documentArchive.DocOrdinal,
            DocTypeId: this.documentArchive.DocTypeId,
            Number: this.documentArchive.Number,
            PublishUnitName: this.documentArchive.PublishUnitName,
            UnitId: this.documentArchive.UnitId,
            RecordId: this.RecordId,
            Format: this.documentArchive.Format,
            ExpiredDate: this.datePipe.transform(this.documentArchive.ExpiredDate),
            IsDocumentOriginal: this.documentArchive.IsDocumentOriginal,
            CreateUserId: this.documentArchive.CreateUserId,
            attachmentOfDocumentArchives: this.documentArchive.attachmentOfDocumentArchives,
        };

        this.documentArchiveService.saveDocumentArchive(datasend).subscribe((data: any) => {
            this.toastr.success(`Thành công`);
            this.dialogRef.close(1);
        });
    }
}
