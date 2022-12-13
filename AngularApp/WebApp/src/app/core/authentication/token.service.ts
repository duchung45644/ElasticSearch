import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { LocalStorageService } from '@shared/services/storage.service';
import { TokenModel, AuthReferrer } from './interface';

const TOKEN_KEY = 'jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private change$ = new BehaviorSubject(null);

  /**
   * The referrer of current page
   */
  get referrer() {
    return this._referrer;
  }

  private _referrer: AuthReferrer = {};

  constructor(private store: LocalStorageService) {}

  set(data: TokenModel): boolean {
    this.change$.next(data);
    return this.store.setCookie(TOKEN_KEY, data);
  }

  get<T extends TokenModel>(type?: new () => T): T {
    const data = this.store.getCookie(TOKEN_KEY);
    return type ? (Object.assign(new type(), data) as T) : (data as T);
  }

  clear() {
    this.store.removeCookie(TOKEN_KEY);
  }

  change(): Observable<TokenModel | null> {
    return this.change$.pipe(share());
  }
}
