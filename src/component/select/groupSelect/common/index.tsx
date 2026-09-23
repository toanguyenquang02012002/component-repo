import type {
  ItemSelectProduct,
  SelectGroupConfig,
  SelectGroupValue,
  SelectGroupValues,
} from '../../../form/form/entity';

export const getInitialValues = (
  groups: SelectGroupConfig[] = [],
  value?: SelectGroupValues,
): SelectGroupValues => {
  return groups.reduce<SelectGroupValues>((result, group) => {
    const currentValue = value?.[group.key] ?? group.value;
    const selectedFromData = group.data.filter(item => item.isSelected);

    result[group.key] =
      currentValue ??
      (group.mode === 'multi' ? selectedFromData : selectedFromData[0]);

    return result;
  }, {});
};

export const getValueLabel = (value: SelectGroupValue) => {
  if (Array.isArray(value)) {
    return value.map(item => item.name).join(', ');
  }

  return value?.name ?? '';
};

export const isSelected = (
  group: SelectGroupConfig,
  item: ItemSelectProduct,
  value: SelectGroupValue,
) => {
  if (group.mode === 'multi') {
    return Array.isArray(value) && value.some(i => i.value === item.value);
  }

  return !Array.isArray(value) && value?.value === item.value;
};

export const getSelectedCount = (value: SelectGroupValue) => {
  if (Array.isArray(value)) {
    return value.length;
  }

  return value ? 1 : 0;
};
