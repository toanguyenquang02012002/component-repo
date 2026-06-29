import React from 'react';
import { Input } from '../input';
import { FormItemRenderProps } from '../../form/form/entity';

export const InputForm = ({
  index,
  item,
  onChangeText,
  resetError,
}: FormItemRenderProps) => {
  return (
    <Input
      autoCapitalize={item.autoCapitalize}
      editable={!item.disabled}
      error={item.error}
      isHighlightCopy={item.isHighlightCopy}
      keyboardType={item.keyboardType}
      label={item.label}
      maxLength={item.maxLength}
      multiline={item.multiline}
      onChangeText={value => {
        item.isHighlightCopy = false;
        item.value = value;
        onChangeText?.(value, index, item.key);
        resetError?.();
      }}
      showbgcl={item.showbgcl}
      showBorder={item.showBorder}
      value={typeof item.value === 'string' ? item.value : ''}
      xheight={item.multiline ? 1 : undefined}
    />
  );
};
