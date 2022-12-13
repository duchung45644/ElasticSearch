import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { FormlyModule } from '@ngx-formly/core';
import { ArrayTypeComponent, FormlyFieldComboboxComponent, NullTypeComponent, RepeatTypeComponent } from './formly-templates';
import { FormlyWrapperPanelComponent } from './formly-wrappers';
import { FormlyValidations } from './formly-validations';

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
    { name: 'repeat', component: RepeatTypeComponent },
    { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
    { name: 'array', component: ArrayTypeComponent },
    // { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
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
    RepeatTypeComponent,
    NullTypeComponent,
    ArrayTypeComponent
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
