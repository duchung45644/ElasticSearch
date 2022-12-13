import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { FormlyModule } from '@ngx-formly/core';
import { ArrayTypeComponent, FormlyFieldComboboxComponent, MultiSchemaTypeComponent, NullTypeComponent, ObjectTypeComponent } from './formly-template';
import { FormlyWrapperPanelComponent } from './formly-wrapper';
import { FormlyValidation } from './formly-validation';

/**
 * Formly global configuration
 */
const formlyModuleProviders = FormlyModule.forRoot({
  //types: [{ name: 'combobox', component: FormlyFieldComboboxComponent }],
  wrappers: [{ name: 'panel', component: FormlyWrapperPanelComponent }],
  validationMessages: [],
  types: [
    { name: 'combobox', component: FormlyFieldComboboxComponent },
    { name: 'string', extends: 'input' },
    {
      name: 'number',
      extends: 'input',
      defaultOptions: {
        templateOptions: {
          type: 'number',
        },
      },
    },
    {
      name: 'integer',
      extends: 'input',
      defaultOptions: {
        templateOptions: {
          type: 'number',
        },
      },
    },
    { name: 'boolean', extends: 'checkbox' },
    { name: 'enum', extends: 'select' },
    { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
    { name: 'array', component: ArrayTypeComponent },
    { name: 'object', component: ObjectTypeComponent },
    { name: 'multischema', component: MultiSchemaTypeComponent },
    {
      name: 'date',
      extends: 'datepicker',
      // defaultOptions: {
      //   parsers: [transformDate]
      // }
    }
  ],
}).providers;

@NgModule({
  imports: [SharedModule],
  declarations: [FormlyFieldComboboxComponent, FormlyWrapperPanelComponent,
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent
  ],
  providers: [FormlyValidation],
})
export class FormlyConfigModule {
  constructor(formlyValidation: FormlyValidation) {
    formlyValidation.init();
  }

  static forRoot(): ModuleWithProviders<FormlyConfigModule> {
    return {
      ngModule: FormlyConfigModule,
      providers: [formlyModuleProviders],
    };
  }
}
