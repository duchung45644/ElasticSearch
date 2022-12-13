import { HttpClient, HttpEventType } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TokenService, ConfigService } from "@core";
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: "formly-field-file",
  template: `
  <div class="upload_group">
      <div class="upload_group_button"> 
      <div class="filename">{{model.FileName}}</div>
      <input
              #fileinput
              [multiple]="to.multiple"
              id="file-input"
              type="file"
              [formControl]="formControl"
              [formlyAttributes]="field"
              (change)="onChange($event)"
              accept=".png,.jpg,.pdf,.doc,.docx"
              style="display: none"
            />
            
        <button type="button" [loading]="loadingUpload" 
                mat-raised-button color="basic" (click)="openFileInput()">
          <mat-icon>cloud_upload</mat-icon>
        </button>
      </div>
      <div class="upload_group_message"  *ngIf="progress > 0">
        <mtx-progress [value]="progress" [striped]="true" foreground="#169c05" background="#e0e0e0"> {{progress}}%
        </mtx-progress>
      </div>
  </div>
 
  `,
  styleUrls: ["./file-type.component.scss"]
})
export class FormlyFieldFile extends FieldType implements OnInit {
  @ViewChild("fileinput") el: ElementRef; 
  selectedFiles: File[];
  progress: number;
  message: string;
  loadingUpload: boolean;

  apiUrl: any;
  uploadUrl: string;
  uploadFinished($event) {
    this.model.FileName = $event.Name;
    this.model.FilePath = $event.Url;
    // // this.filename.nativeElement.value = $event.Name;
    // // this.filepath.nativeElement.value = $event.Url;
    if (this.to.onUploadFinished) {
      this.to.onUploadFinished($event);
    }
  }


  constructor(public sanitizer: DomSanitizer, private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private token: TokenService,
    private config: ConfigService) {
    super();
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  ngOnInit() {
    this.uploadUrl = this.to.url || 'upload/UploadImage';
    this.loadingUpload = false;
  }
  openFileInput() {
    this.el.nativeElement.click();
  }
  onDelete(index) {
    // this.formControl.reset();
    console.log(this.selectedFiles);
    this.selectedFiles.splice(index, 1);

    this.formControl.patchValue(this.selectedFiles);
    console.log("Form Control Value", this.formControl.value);
  }
  onChange(event) {
    this.selectedFiles = Array.from(event.target.files);
    let files = this.selectedFiles;
    console.log(this.selectedFiles);
    this.progress = 0;
    this.message = '';
    if (files.length === 0) {
      return;
    }
    this.loadingUpload = true;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    try {
      this.http.post(`${this.apiUrl + this.uploadUrl}`, formData, {
        headers: {
          'Authorization': `Bearer ${this.token.get().token}`
        },
        reportProgress: true,
        observe: 'events'
      })
        .subscribe(event => {

          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);

            if (this.progress >= 100) {
              this.progress = 0;
            }
            this.cdr.detectChanges();
          }

          else if (event.type === HttpEventType.Response) {
            this.message = 'OK';
            this.loadingUpload = false;
          //  this.model.FileName = "$event.Name";
         //   this.model.FilePath = "$event.Url"; console.log(this.model);
            this.uploadFinished(event.body);
          }
          this.el.nativeElement.value = '';

        }, error => {
          this.el.nativeElement.value = '';

          this.loadingUpload = false;
        });
    } catch (error) {
      this.loadingUpload = false;
    }
  }
  getSanitizedImageUrl(file: File) {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }
  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }
}
/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
