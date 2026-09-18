import React, { useMemo } from 'react';
import {
  FormItemRenderProps,
  ItemSelectProduct,
} from '../../form/form/entity';
import { MultiRadio } from '../multiRadio';

const isItemSelectProduct = (value: unknown): value is ItemSelectProduct =>
  typeof value === 'object' &&
  value !== null &&
  'value' in value &&
  'name' in value;

export const MultiRadioForm = ({
  index,
  item,
  onSelected,
  resetError,
}: FormItemRenderProps): React.ReactElement => {
  const itemSelected = useMemo(() => {
    if (!Array.isArray(item.value)) {
      return item.dataRadio.filter(option => option.isSelected);
    }

    return item.value
      .map(value => {
        if (isItemSelectProduct(value)) {
          return value;
        }

        return item.dataRadio.find(option => option.value === value);
      })
      .filter((value): value is ItemSelectProduct => value !== undefined);
  }, [item.dataRadio, item.value]);

  return (
    <MultiRadio
      data={item.dataRadio}
      disabled={item.disabled}
      error={item.error}
      horizontal={!item.vertical}
      itemSelected={itemSelected}
      label={item.label}
      maxSelected={item.maxSelected}
      minSelected={item.minSelected}
      onSelected={values => {
        const selectedValues = new Set(values.map(value => value.value));

        item.value = values;
        item.dataRadio = item.dataRadio.map(option => ({
          ...option,
          isSelected: selectedValues.has(option.value),
        }));
        item.isHighlightCopy = false;

        onSelected?.(values, index, item.key);
        resetError?.();
      }}
    />
  );
};
