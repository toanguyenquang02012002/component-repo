import React from 'react';
import {
  FilterDashboardOrg,
  FormItemRenderProps,
} from '../../form/form/entity';
import { TreeSelect } from '../treeSelect';

const isTreeItem = (value: unknown): value is FilterDashboardOrg =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'orgName' in value;

export const TreeSelectForm = ({
  index,
  item,
  onSelected,
  resetError,
}: FormItemRenderProps): React.ReactElement => {
  const selectedItems = Array.isArray(item.value)
    ? item.value.filter(isTreeItem)
    : isTreeItem(item.value)
      ? [item.value]
      : [];

  return (
    <TreeSelect
      data={item.dataTree}
      disabled={item.disabled}
      error={item.error}
      itemSelected={selectedItems}
      label={item.label}
      onSelected={value => {
        item.value = value;
        item.isHighlightCopy = false;

        onSelected?.(value, index, item.key);
        resetError?.();
      }}
      searchBox={item.searchBox}
    />
  );
};
