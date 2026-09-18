import { KeyboardType } from 'react-native';
import { TextInputProps } from 'react-native-paper';
export interface FormRef {
  resetError: (index?: number) => void;
}

export interface FormProps {
  data: Array<FormItemsProps>;
  onChangeText?: (value: string, index: number, key: string) => void;
  onChangeDate?: (
    value: Date | string | undefined,
    index: number,
    key: string,
  ) => void;
  onChangeTextSearch?: (value: string, index: number, key: string) => void;
  onPaging?: (index: number, key: string) => void;
  onSelected?: (value: any, index: number, key: string) => void;
  onFocus?: (value: any, index: number, key: string) => void;
  onBlur?: (value: any, index: number, key: string) => void;
}

export interface FormItemRenderProps extends FormProps {
  index: number;
  item: FormItemsProps;
  resetError?: () => void;
}

export type SelectGroupMode = 'single' | 'multi';

export type SelectGroupValue =
  | ItemSelectProduct
  | ItemSelectProduct[]
  | undefined;

export type SelectGroupValues = Record<string, SelectGroupValue>;

export interface SelectGroupConfig {
  key: string;
  label: string;
  mode: SelectGroupMode;
  data: ItemSelectProduct[];
  value?: SelectGroupValue;
  maxSelected?: number;
  minSelected?: number;
  required?: boolean;
  searchBox?: boolean;
}

export interface ItemSelectProduct {
  id: number;
  name: string;
  value: string;
  isSelected: boolean;
  isOtherValue?: any;
  canPress?: boolean;
  isNotRemoveBecauseInitial?: boolean;
}
export interface ItemGroupTextInput {
  label: string;
  type: 'month' | 'year';
  value: string;
}
export interface GroupTextInputProps {
  data: Array<ItemGroupTextInput>;
  keyboardType?: KeyboardType;
  maxLength?: number;
  onChangeText?: (text: string, type?: 'month' | 'year') => void;
  error?: string;
  disabled?: boolean;
  onBlurAction?: Function;
}
export interface RadioProps {
  id: number | string | any;
  label: string;
  isChecked: boolean;
}
export interface FilterDashboardOrg {
  id: number;
  createdDate: string;
  createdBy: string;
  modifiedDate?: string;
  modifiedBy?: string;
  deleted: number;
  orgName: string;
  orgCode: string;
  orgLevel: string;
  status: number;
  orgParentId?: number;
  children?: FilterDashboardOrg[];
  level?: number;
}
export interface FormItemsProps {
  key: string;
  type:
    | 'INPUT'
    | 'SELECT'
    | 'PORTRAIT'
    | 'DATE'
    | 'YEAR'
    | 'GROUPINPUT'
    | 'GROUPRADIO'
    | 'MULTI_SELECT'
    | 'INSERTVIEW'
    | 'TREE_SELECT'
    | 'MULTI_SELECT_NEW'
    | 'GROUP_SELECT'
    | 'IMPUT_HTML'
    | 'INPUT_SELECT'
    | 'MONTH_YEAR';
  label: string;
  value:
    | string
    | number
    | ItemSelectProduct
    | Array<ItemGroupTextInput>
    | ItemSelectProduct[]
    | number[]
    | string[]
    | any;
  valueSelect?:
    | string
    | number
    | ItemSelectProduct
    | Array<ItemGroupTextInput>
    | ItemSelectProduct[]
    | number[]
    | string[]
    | any;
  error?: string;
  isRequire: boolean;
  isCloneRequire?: boolean;
  dataRadio: Array<RadioProps>;
  dataSelect: ItemSelectProduct[];
  dataTree?: FilterDashboardOrg[];
  disabled: boolean;
  keyboardType?: KeyboardType;
  multiline?: boolean;
  maxLength?: number;
  isShow?: boolean;
  isPaging?: boolean;
  canLoadMore?: boolean;
  vertical?: boolean;
  maxSelected?: number;
  submitMode?: 'immediate' | 'confirm';
  isMoney?: boolean;
  valueOther?: string | number | ItemSelectProduct | Array<ItemGroupTextInput>;
  minValue?: number | Date | string;
  maxValue?: number | Date;
  unit?: string;
  searchBox?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textSearch?: string;
  isPhone?: boolean;
  filterOption?: boolean;
  isShowText?: boolean;
  showbgcl?: boolean;

  showBorder?: boolean;
  isRightView?: boolean;
  onPressRightView?: () => void;
  ortherLabel?: string;
  keyObjValue?: string;
  keyObjValue2?: string;
  indexView?: number;
  isHighlightCopy?: boolean;
  isShowbtnDelete?: boolean;
  onPressDelete?: (e?: any) => void;
  mode?: 'date' | 'time' | 'datetime';
  labelSelect?: string;
  isHasSelectOld?: boolean;
  selectGroups?: SelectGroupConfig[];

  row?: string;
  flex?: number;
}
