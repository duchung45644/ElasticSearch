import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
import { TokenService } from '@core/authentication/token.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent implements OnInit {
  public progress: number;
  public loadingUpload: boolean;
  public message: string;
  public apiUrl: string;
  @ViewChild('file') myInputVariable: ElementRef;

  @Input() url = '';
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private token: TokenService,
    private config: ConfigService) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  ngOnInit() {
    this.url = this.url || 'upload/UploadImage';
    this.loadingUpload = false;
  }
  public uploadFile = (files) => {
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
      this.http.post(`${this.apiUrl + this.url}`, formData, {
        headers: {
          'Authorization': `Bearer ${this.token.get().token}`
        },
        reportProgress: true,
        observe: 'events'
      })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);

            if(this.progress>=100){
              this.progress=0;
            }
            this.cdr.detectChanges();
          }

          else if (event.type === HttpEventType.Response) {
            this.message = 'OK';

            this.loadingUpload = false;
            this.onUploadFinished.emit(event.body);
          }
          this.myInputVariable.nativeElement.value = '';

        }, error => {
          this.myInputVariable.nativeElement.value = '';

          this.loadingUpload = false;
        });
    } catch (error) {
      this.loadingUpload = false;
    }

  }
}