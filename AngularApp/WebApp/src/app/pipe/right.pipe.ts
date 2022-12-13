
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterRightPipe'
})
export class FilterRightPipe implements PipeTransform {
    transform(items: any, parentId?: any): any {
        if (!items)
            return items;
        if (parentId == 0)
            return items.filter(item=> item.ParentId == undefined || item.ParentId == null || item.ParentId == 0);
        else
            return items.filter(item=>item.ParentId == parentId);
    }
}