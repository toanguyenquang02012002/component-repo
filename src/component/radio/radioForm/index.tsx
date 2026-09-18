import React, { useMemo } from 'react';
import {
  FormItemRenderProps,
  ItemSelectProduct,
} from '../../form/form/entity';
import { Radio } from '../radio';

export const RadioForm = ({
  index,
  item,
  onSelected,
  resetError,
}: FormItemRenderProps): React.ReactElement => {
  const itemSelected = useMemo(() => {
    if (
      item.value &&
      !Array.isArray(item.value) &&
      typeof item.value === 'object'
    ) {
      return item.value as ItemSelectProduct;
    }

    return item.dataRadio.find(
      option =>
        option.value === item.value || option.isSelected === true,
    );
  }, [item.dataRadio, item.value]);

  return (
    <Radio
      data={item.dataRadio}
      disabled={item.disabled}
      error={item.error}
      horizontal={!item.vertical}
      itemSelected={itemSelected}
      label={item.label}
      onSelected={value => {
        item.value = value;
        item.dataRadio = item.dataRadio.map(option => ({
          ...option,
          isSelected: option.value === value.value,
        }));
        item.isHighlightCopy = false;

        onSelected?.(value, index, item.key);
        resetError?.();
      }}
    />
  );
};
