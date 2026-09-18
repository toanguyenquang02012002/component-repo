import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { ItemSelectProduct } from '../../select/select/entity';

export interface RadioBaseProps<
  T extends ItemSelectProduct = ItemSelectProduct,
> {
  data?: T[];
  label?: string;
  disabled?: boolean;
  error?: string;
  horizontal?: boolean;
  activeColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export interface RadioProps<T extends ItemSelectProduct = ItemSelectProduct>
  extends RadioBaseProps<T> {
  itemSelected?: T;
  onSelected?: (item: T) => void;
}

export interface MultiRadioProps<
  T extends ItemSelectProduct = ItemSelectProduct,
>
  extends RadioBaseProps<T> {
  itemSelected?: T[];
  onSelected?: (items: T[]) => void;
  maxSelected?: number;
  minSelected?: number;
}
