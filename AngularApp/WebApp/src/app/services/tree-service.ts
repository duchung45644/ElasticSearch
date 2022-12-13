import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class TreeDataService {

  constructor() { }

  private unflatten(array: any, parent: any, tree: any) {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { value: 0 };

    var children = array.filter(child => child.parentid == parent.value);

    if (children.length > 0) {
      if (parent.value == 0) {
        tree = children;
      } else {
        parent['children'] = children
      }
      children.forEach(obj => {
        this.unflatten(array, obj, undefined)
      });

    }

    return tree;
  }
  public createTreeData(data: any): TreeviewItem[] {
    var list = this.unflatten(data, undefined, undefined).map(item => {
      return new TreeviewItem({ text: item.text, value: item.value, collapsed: true, children: item.children });
    });

    return list;
  }

}
