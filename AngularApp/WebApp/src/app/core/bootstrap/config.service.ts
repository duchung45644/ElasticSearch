import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';


export interface Config {
  apiBaseUrl: string;
  baseUrl: string;
  fileBaseUrl: string;
  pageSize: number;
  importAssetsTemplate:string;
}


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config$: Subject<Config> = new Subject<Config>();

  private config: Config;
  getConfig() {
    return this.config;
  }

  set(config: Config) {

    this.config = config;
    console.log(this.config);
    this.config$.next(this.config);

  }
}
