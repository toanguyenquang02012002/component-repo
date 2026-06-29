import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export interface TextFieldProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  leftView?: boolean;
  rightView?: string | boolean;
  onPressRight?: () => void;
  error?: string | boolean;
  isRequire?: boolean;
  label: string;
  unit?: string;
  showUnit?: boolean;
  rightColor?: string;
  isHighlightCopy?: boolean;
  rightIcon?: React.ReactNode;
  showBorder?: boolean;
  showbgcl?: boolean;
  xheight?: number;
}
