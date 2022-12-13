import {LOCALE_ID, NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FormlyModule } from '@ngx-formly/core';
import { ArrayFileComponent, ArrayTypeComponent, FormlyFieldComboboxComponent, NullTypeComponent, ObjectTypeComponent } from './formly-templates';
import { FormlyWrapperPanelComponent } from './formly-wrappers';
import { FormlyValidations } from './formly-validations';
import { FileValueAccessor } from './file-value-accessor';
import { FormlyFieldFile } from './file-type.component';

/**
 * Formly global configuration
 */
const formlyModuleProviders = FormlyModule.forRoot({
  types: [
    {
      name: 'combobox',
      component: FormlyFieldComboboxComponent,
      wrappers: ['form-field'],
    },
    { name: 'object', component: ObjectTypeComponent },
    { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
    { name: 'array', component: ArrayTypeComponent },
    { name: 'arrayfile', component: ArrayFileComponent },
    { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }
    
  ],
  wrappers: [
    {
      name: 'panel',
      component: FormlyWrapperPanelComponent,
    },
  ],
  validationMessages: [],
}).providers as Provider[];

@NgModule({
  imports: [SharedModule],
  declarations: [FormlyFieldComboboxComponent, FormlyWrapperPanelComponent,
    ObjectTypeComponent,
    NullTypeComponent,
    ArrayTypeComponent,ArrayFileComponent,
    FormlyFieldFile,
    FileValueAccessor,
  ],
  providers: [FormlyValidations],
})
export class FormlyConfigModule {
  constructor(formlyValidations: FormlyValidations) {
    formlyValidations.init();
  }

  static forRoot(): ModuleWithProviders<FormlyConfigModule> {
    return {
      ngModule: FormlyConfigModule,
      providers: [formlyModuleProviders],
    };
  }
}
