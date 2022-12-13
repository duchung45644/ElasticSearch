import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DocumentArchive } from 'app/models/DocumentArchive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from './list.service';
import { ConfigService } from '@core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
    selector: 'dialog-documentArchivesView-form',
    styles: [
        `
            .demo-full-width {
                width: 100%;
            }
        `,
    ],

    templateUrl: './dialog-documentArchivesView-form.html',
})
export class CreateDocumentArchivesViewComponent {
    fileBaseUrl: any;
    DocumentArchivesView: DocumentArchive;
    ConditionList: any;
    languageList: any;
    DocumentArchiveId: any;
    catalogList: any;
    viewId: any;
    url: any;
    import: any;
    FileName: any;
    FileArchive: any;
    urldownload: any;

    constructor(
        private listService: ListService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private dialogRef: MatDialogRef<CreateDocumentArchivesViewComponent>,
        private config: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.DocumentArchivesView = new DocumentArchive();
        this.DocumentArchiveId = data.viewId;
        this.viewId = data.value;
        var conf = this.config.getConfig();
        this.fileBaseUrl = conf.fileBaseUrl;
        this.import = {
            Url: 'upload/UploadFile',
        };
    }

    ngOnInit() {
        this.getData();
        if (this.url == undefined || this.url == null) {
            this.url = '';
        }
    }
    getData() {
        if (this.viewId != 0) {
            this.listService.getbyidDocView({ Id: this.DocumentArchiveId }).subscribe((data: any) => {
                this.DocumentArchivesView = data.Data;
                this.cdr.detectChanges();
            });
        }
    }
    getallcatalog() {
        this.listService.getallcatalog({}).subscribe((data: any) => {
            this.catalogList = data.Data.Catalogs;
        });
    }
    GetAllAttachmentOfDocument() {
        this.listService.GetAllAttachmentOfDocument({}).subscribe((data: any) => {
            this.FileArchive = data.Data;
        });
    }
}
