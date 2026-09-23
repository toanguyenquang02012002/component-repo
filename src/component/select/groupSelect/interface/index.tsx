import type {
  SelectGroupConfig,
  SelectGroupValues,
} from '../../../form/form/entity';

export interface GroupSelectProps {
  label: string;
  groups?: SelectGroupConfig[];
  value?: SelectGroupValues;
  error?: string;
  disabled?: boolean;
  isHighlightCopy?: boolean;
  onSubmit?: (value: SelectGroupValues) => void;
}
