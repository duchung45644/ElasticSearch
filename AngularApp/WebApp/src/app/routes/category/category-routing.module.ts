import { RecordtypeComponent } from './recordtype/recordtype.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommuneComponent } from '../category/commune/commune.component';
import { ProvinceComponent } from '../category/province/province.component';
import { DistrictComponent } from '../category/district/district.component';

import { PositionComponent } from '../category/position/position.component';

import { MessagecontentComponent } from '../category/message/message.component';
//import { CateComponent } from "../category/cate/cate.component";
import { CategoriesComponent } from './categories/categories.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CategoryComponent } from './category/category.component';
import { V2Component } from './v2/v2.component';

import { CatalogComponent } from './catalog/catalog.component';
import { FieldsComponent } from './fields/fields.component';
import { ConditionComponent } from './condition/condition.component';

const routes: Routes = [
    { path: 'province', component: ProvinceComponent, data: { title: 'Tỉnh/thành' } },

    { path: 'district', component: DistrictComponent, data: { title: 'Quận/huyện' } },

    { path: 'commune', component: CommuneComponent, data: { title: 'Xã/phường' } },

    { path: 'position', component: PositionComponent, data: { title: 'Chức vụ' } },
    { path: 'message', component: MessagecontentComponent, data: { title: 'message' } },
    { path: 'dm1', component: CategoryComponent, data: { title: 'cate' } },
    { path: 'dm/:code', component: CategoryComponent, data: { title: 'cate' } },
    { path: 'categories', component: CategoriesComponent, data: { title: 'categories' } },
    { path: 'dynamicform', component: DynamicFormComponent, data: { title: 'Test form json' } },
    { path: 'v2/:code', component: V2Component, data: { title: 'cate' } },
    { path: 'catalog', component: CatalogComponent, data: { title: 'cate' } },
    { path: 'fields', component: FieldsComponent, data: { title: 'cate' } },
    { path: 'condition', component: ConditionComponent, data: { title: 'cate' } },
    { path: 'recordtype', component: RecordtypeComponent, data: { title: 'cate' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CategoryRoutingModule {}
