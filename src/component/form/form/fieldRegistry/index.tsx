import { ComponentType } from 'react';
import { FormItemRenderProps, FormItemsProps } from '../entity';
import { CurrencyForm, InputForm } from '../../../input';
import { DatePickerForm } from '../../../datePicker';
import { SelectMultiForm } from '../../../select/multiselectForm';
import { SelectForm } from '../../../select/selectForm';
import { GroupSelectForm } from '../../../select/groupSelectForm';
import { MultiRadioForm, RadioForm } from '../../../radio';
import { TreeSelectForm } from '../../../treeSelect';

export type FieldType = FormItemsProps['type'];

export type FieldComponent = ComponentType<FormItemRenderProps>;

export const fieldRegistry: Partial<Record<FieldType, FieldComponent>> = {
  INPUT: InputForm,
  TEXTAREA: InputForm,
  PHONE: InputForm,
  EMAIL: InputForm,
  PASSWORD: InputForm,

  CURRENCY: CurrencyForm,

  DATE: DatePickerForm,
  YEAR: DatePickerForm,
  MONTH_YEAR: DatePickerForm,

  SELECT: SelectForm,
  MULTI_SELECT: SelectMultiForm,
  GROUP_SELECT: GroupSelectForm,

  RADIO: RadioForm,
  GROUPRADIO: RadioForm,
  MULTI_RADIO: MultiRadioForm,
  TREE_SELECT: TreeSelectForm,
};
