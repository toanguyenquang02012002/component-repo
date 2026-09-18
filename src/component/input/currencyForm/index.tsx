import React from 'react';
import { FormItemRenderProps } from '../../form/form/entity';
import { Input } from '../input';

const formatCurrency = (value: unknown): string => {
  if (value === '' || value === undefined || value === null) {
    return '';
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/[^0-9]/g, ''));

  if (!Number.isFinite(numericValue)) {
    return '';
  }

  return Math.trunc(numericValue).toLocaleString('vi-VN');
};

export const CurrencyForm = ({
  index,
  item,
  onChangeText,
  resetError,
  onFocus,
  onBlur,
}: FormItemRenderProps): React.ReactElement => {
  return (
    <Input
      editable={!item.disabled}
      error={item.error}
      isHighlightCopy={item.isHighlightCopy}
      keyboardType="numeric"
      label={item.label}
      maxLength={item.maxLength}
      onBlur={event => onBlur?.(event, index, item.key)}
      onChangeText={text => {
        const digits = text.replace(/[^0-9]/g, '');
        const value = digits === '' ? '' : Number(digits);

        item.isHighlightCopy = false;
        item.value = value;
        onChangeText?.(value, index, item.key);
        resetError?.();
      }}
      onFocus={event => onFocus?.(event, index, item.key)}
      showbgcl={item.showbgcl}
      showBorder={item.showBorder}
      showUnit
      unit={item.unit ?? 'VNĐ'}
      value={formatCurrency(item.value)}
    />
  );
};
