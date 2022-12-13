import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';

import { DocumentArchive } from 'app/models/DocumentArchive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentArchiveService } from './documentarchive.service';
import { ConfigService } from '@core';

@Component({
    selector: 'details-document',
    templateUrl: './details-document.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DocumentArchiveService],
})
export class DetailsDocument {
    documentArchive: DocumentArchive;
    ConditionList: any;
    languageList: any;
    catalogList: any;
    viewId: any;
    import: any;

    constructor(
        private documentArchiveService: DocumentArchiveService,
        private cdr: ChangeDetectorRef,
        private dialogRef: MatDialogRef<DetailsDocument>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.documentArchive = new DocumentArchive();
        this.viewId = data.viewId;
    }

    ngOnInit() {
        this.GetAllCondition();
        this.getallLanguage();
        this.getallcatalog();
        this.getData();
    }

    getData() {
        this.documentArchive = new DocumentArchive();
        if (this.viewId != 0) {
            this.documentArchiveService.getbyid({ Id: this.viewId }).subscribe((data: any) => {
                this.documentArchive = data.Data;
                console.log(this.documentArchive);

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
}
