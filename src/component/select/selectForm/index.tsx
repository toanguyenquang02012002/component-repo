import React, { useEffect, useState } from 'react';
import { Select } from '../select';
import { FormItemRenderProps } from '../../form/form/entity';

export const SelectForm = ({
  index,
  item,
  onChangeTextSearch,
  onPaging,
  onSelected,
  resetError,
}: FormItemRenderProps) => {
  const [search, setSearch] = useState(item.textSearch ?? '');

  useEffect(() => {
    if (!onChangeTextSearch) {
      return;
    }

    if (search === '') {
      onChangeTextSearch(search, index, item.key);
      return;
    }

    const timeout = setTimeout(() => {
      onChangeTextSearch(search, index, item.key);
    }, 500);

    return () => clearTimeout(timeout);
  }, [index, item.key, onChangeTextSearch, search]);

  return (
    <Select
      data={item.dataSelect}
      disabled={item.disabled}
      error={item.error}
      filterOption={item.filterOption}
      isHighlightCopy={item.isHighlightCopy}
      isPaging={item.isPaging}
      itemSelected={
        item.value &&
        !Array.isArray(item.value) &&
        typeof item.value === 'object'
          ? item.value
          : undefined
      }
      label={item.label}
      onChangeTextSearch={(value: string) => {
        item.textSearch = value;
        setSearch(value);
      }}
      onPaging={() => {
        onPaging?.(index, item.key);
      }}
      onSelected={value => {
        item.isHighlightCopy = false;

        if (value) {
          item.value = value;
          onSelected?.(value, index, item.key);
          resetError?.();
          return;
        }

        item.value = '';
        onSelected?.(undefined, index, item.key);
        resetError?.();
      }}
      searchBox={item.searchBox}
      textSearch={item.textSearch}
      unit={item.unit}
    />
  );
};
