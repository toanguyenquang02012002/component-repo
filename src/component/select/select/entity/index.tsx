import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ItemSelectProduct {
  id: number;
  name: string;
  value: string;
  isSelected: boolean;
  isOtherValue?: any;
  canPress?: boolean;
}

export interface SelectProps {
  label: string;
  itemSelected?: ItemSelectProduct;
  onSelected?: (value: ItemSelectProduct | undefined) => void;
  containerStyle?: StyleProp<ViewStyle>;
  data?: ItemSelectProduct[];
  error?: string;
  disabled?: boolean;
  isPaging?: boolean;
  onPaging?: () => void;
  isLoadmore?: boolean;
  selectStyle?: StyleProp<ViewStyle>;
  searchBox?: boolean;
  onChangeTextSearch?: (value: string) => void;
  textSearch?: string;
  unit?: string;
  filterOption?: boolean;
  loading?: boolean;
  isHighlightCopy?: boolean;
  textStyle?: StyleProp<TextStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  snapHeight?: number;
  keyboardVerticalOffset?: number;
}

export interface SelectMultiProps {
  label: string;
  itemSelected?: ItemSelectProduct[];
  onSelected?: (value: ItemSelectProduct[] | undefined) => void;
  containerStyle?: StyleProp<ViewStyle>;
  data?: ItemSelectProduct[];
  error?: string;
  disabled?: boolean;
  isPaging?: boolean;
  onPaging?: () => void;
  isLoadmore?: boolean;
  selectStyle?: StyleProp<ViewStyle>;
  searchBox?: boolean;
  onChangeTextSearch?: (value: string) => void;
  textSearch?: string;
  unit?: string;
  filterOption?: boolean;
  loading?: boolean;
  isHighlightCopy?: boolean;
  textStyle?: StyleProp<TextStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  snapHeight?: number;
  keyboardVerticalOffset?: number;
  maxSelected?: number;
  submitMode?: 'immediate' | 'confirm';
}
