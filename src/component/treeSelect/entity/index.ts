import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { FilterDashboardOrg } from '../../form/form/entity';

export interface TreeSelectProps {
  data?: FilterDashboardOrg[];
  itemSelected?: FilterDashboardOrg[];
  label: string;
  onSelected?: (value: FilterDashboardOrg[]) => void;
  disabled?: boolean;
  error?: string;
  searchBox?: boolean;
  snapHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
