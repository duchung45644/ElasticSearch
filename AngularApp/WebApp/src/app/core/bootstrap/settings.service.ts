import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults } from '../settings';

export const USER_KEY = 'usr';
export const RIGHT_KEY = 'usr_right';

export const MENU_KEY = 'menu';
export const ACTION_KEY = 'usr_action';

export interface User {
  UserName?: string;
  DisplayName?: string;
  avatar?: string;
  RememberMe: boolean;
  UserId: number;
  Id: number;
  DepartmentId: number;
  PositionId: number;
  UnitId: number;
  Code: string;
  FirstName: string;
  LastName: string;
  Gender: any;
  Email: string;
  Phone: string;
  Mobile: string;
  BirthOfDay: Date;
  Address: string;
  DossierReturnAddress: string;
  Image: string;
  IDCard: string;
  IDCardDate: Date;
  IDCardPlace: string;
  DepartmentNameReceive: string;
  PhoneOfDepartmentReceive: string;
  PasswordChanged: boolean;
  IsAdministrator: boolean;
  PlaceOfReception: number;
  LastLoginDate: Date;
  IsLocked: boolean;
  IsDeleted: boolean;
  ModifiedUserId: number;
  ModifiedDate: Date;
  CreatedUserId: number;
  CreatedDate: Date;
  Token: string;
  UnitResolveInformation: string;
  IsShowAllDocument: boolean;
  IsRepresentUnit: boolean;
  IsRepresentDepartment: boolean;
  CommuneId: number;
  SignImage: string;
  SignPhone: string;
}


export interface MenuTag {
  color: string; // Background Color
  value: string;
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  children?: MenuChildrenItem[];
}

export interface Menu {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  label?: MenuTag;
  badge?: MenuTag;
  children?: MenuChildrenItem[];
}


@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private store: LocalStorageService) { }

  private options = defaults;

  get notify(): Observable<any> {
    return this.notify$.asObservable();
  }
  private notify$ = new BehaviorSubject<any>({});

  setLayout(options?: AppSettings): AppSettings {
    this.options = Object.assign(defaults, options);
    return this.options;
  }

  setNavState(type: string, value: boolean) {
    this.notify$.next({ type, value } as any);
  }

  getOptions(): AppSettings {
    return this.options;
  }

  /** User information */

  get user() {
    return this.store.getCookie(USER_KEY);
  }

  get menus() {
    return this.store.get(MENU_KEY);
  }
  get userRight() {
    return this.store.get(RIGHT_KEY);
  }
  get userAction() {
    return this.store.get(ACTION_KEY);
  }

  setUser(value: any) {
    this.store.setCookie(USER_KEY, value.Data);
    this.store.set(MENU_KEY, value.Menus);
    this.store.set(RIGHT_KEY, value.Rights);
    this.store.set(ACTION_KEY, value.Actions);
  }

  removeUser() {
    this.store.removeCookie(USER_KEY);
    this.store.remove(MENU_KEY);
    this.store.remove(RIGHT_KEY);

    this.store.remove(ACTION_KEY);
    this.store.clear();
    this.store.clearCookie();
  }
  hasAction(code: string) {
    let ACTION_KEY = 'usr_action'
    var actions = this.store.get(ACTION_KEY);
    var result = actions.filter(obj => {
      return obj.Code === code
    })
    if (result !=null && result != undefined && result.length > 0) {
      return true;
    }
    return false;
  }
  /** System language */

  get language() {
    return this.options.language;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.notify$.next({ lang });
  }


  /** menu **/

  getMenuItemName(routeArr: string[]): string {
    return this.getMenuLevel(routeArr)[routeArr.length - 1];
  }

  /** Menu level */

  private isLeafItem(item: MenuChildrenItem): boolean {
    //// if a menuItem is leaf
    const cond0 = item.route === undefined;
    const cond1 = item.children === undefined;
    const cond2 = !cond1 && item.children.length === 0;
    return cond0 || cond1 || cond2;
  }

  private deepcopyJsonObj(jobj: any): any {
    //// deepcop object-could-be-jsonized
    return JSON.parse(JSON.stringify(jobj));
  }

  private jsonObjEqual(jobj0: any, jobj1: any): boolean {
    //// if two objects-could-be-jsonized equal
    const cond = JSON.stringify(jobj0) === JSON.stringify(jobj1);
    return cond;
  }

  private routeEqual(routeArr: Array<string>, realRouteArr: Array<string>): boolean {
    //// if routeArr equals realRouteArr(after remove empty-route-element)
    realRouteArr = this.deepcopyJsonObj(realRouteArr);
    realRouteArr = realRouteArr.filter(r => r !== '');
    return this.jsonObjEqual(routeArr, realRouteArr);
  }
  getMenuLevel(routeArr: string[]): string[] {
    let tmpArr = [];
    this.menus.forEach(item => {
      //// breadth-first-traverse -modified
      let unhandledLayer = [{ item, parentNamePathList: [], realRouteArr: [] }];
      while (unhandledLayer.length > 0) {
        let nextUnhandledLayer = [];
        for (const ele of unhandledLayer) {
          const eachItem = ele.item;
          const currentNamePathList = this.deepcopyJsonObj(ele.parentNamePathList).concat(
            eachItem.name
          );
          const currentRealRouteArr = this.deepcopyJsonObj(ele.realRouteArr).concat(eachItem.route);
          //// compare the full Array
          //// for expandable
          const cond = this.routeEqual(routeArr, currentRealRouteArr);
          if (cond) {
            tmpArr = currentNamePathList;
            break;
          }

          const isLeafCond = this.isLeafItem(eachItem);
          if (!isLeafCond) {
            const children = eachItem.children;
            const wrappedChildren = children.map(child => ({
              item: child,
              parentNamePathList: currentNamePathList,
              realRouteArr: currentRealRouteArr,
            }));
            nextUnhandledLayer = nextUnhandledLayer.concat(wrappedChildren);
          }
        }
        unhandledLayer = nextUnhandledLayer;
      }
    });
    return tmpArr;
  }
  
  getMenuLevelV2(routeArr: string): string[] {
    let tmpArr = [];
    this.menus.forEach(item => {
      //// breadth-first-traverse -modified
      let unhandledLayer = [{ item, parentNamePathList: [], realRouteArr: [] }];
      while (unhandledLayer.length > 0) {
        let nextUnhandledLayer = [];
        for (const ele of unhandledLayer) {
          const eachItem = ele.item;
          const currentNamePathList = this.deepcopyJsonObj(ele.parentNamePathList).concat(
            eachItem.name
          );
          const currentRealRouteArr = this.deepcopyJsonObj(ele.realRouteArr).concat(eachItem.route);
          //// compare the full Array
          //// for expandable
         // const cond = this.routeEqual(routeArr, currentRealRouteArr);
          if (routeArr==currentRealRouteArr[currentRealRouteArr.length-1]) {
            tmpArr = currentNamePathList;
            break;
          }

          const isLeafCond = this.isLeafItem(eachItem);
          if (!isLeafCond) {
            const children = eachItem.children;
            const wrappedChildren = children.map(child => ({
              item: child,
              parentNamePathList: currentNamePathList,
              realRouteArr: currentRealRouteArr,
            }));
            nextUnhandledLayer = nextUnhandledLayer.concat(wrappedChildren);
          }
        }
        unhandledLayer = nextUnhandledLayer;
      }
    });
    return tmpArr;
  }
}
