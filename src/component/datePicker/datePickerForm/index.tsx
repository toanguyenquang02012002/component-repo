import React from 'react';
import { DatePickerComponent, DatePickerType } from '../datePicker';
import { FormItemRenderProps } from '../../form/form/entity';

const getDatePickerType = (type: string): DatePickerType => {
  if (type === 'YEAR') {
    return 'year';
  }

  if (type === 'MONTH_YEAR') {
    return 'month_year';
  }

  return 'day';
};

export const DatePickerForm = ({
  index,
  item,
  onChangeDate,
  resetError,
}: FormItemRenderProps) => {
  return (
    <DatePickerComponent
      disabled={item.disabled}
      error={item.error}
      isHasSelectOld={item.isHasSelectOld}
      label={item.label}
      maxDate={item.maxValue instanceof Date ? item.maxValue : undefined}
      minDate={item.minValue}
      mode={item.mode}
      onChangeDate={value => {
        item.value = value ?? '';
        onChangeDate?.(value, index, item.key);
        resetError?.();
      }}
      type={getDatePickerType(item.type)}
      value={
        typeof item.value === 'string' || item.value instanceof Date
          ? item.value
          : undefined
      }
    />
  );
};
