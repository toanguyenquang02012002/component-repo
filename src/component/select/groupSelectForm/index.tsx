import React from 'react';
import { GroupSelect } from '../groupSelect';
import { FormItemRenderProps, SelectGroupValues } from '../../form/form/entity';

export const GroupSelectForm = ({
  index,
  item,
  onSelected,
  resetError,
}: FormItemRenderProps) => {
  return (
    <GroupSelect
      disabled={item.disabled}
      error={item.error}
      groups={item.selectGroups}
      isHighlightCopy={item.isHighlightCopy}
      label={item.label}
      value={
        item.value && typeof item.value === 'object' && !Array.isArray(item.value)
          ? (item.value as SelectGroupValues)
          : undefined
      }
      onSubmit={value => {
        item.isHighlightCopy = false;
        item.value = value;
        onSelected?.(value, index, item.key);
        resetError?.();
      }}
    />
  );
};
