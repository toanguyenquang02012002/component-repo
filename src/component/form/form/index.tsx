import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { InputForm } from '../../input/inputForm';
import { SelectForm } from '../../select/selectForm';
import { FormItemsProps, FormProps, FormRef } from './entity';
import { SelectMultiForm } from '../../select/multiselectForm';
import { GroupSelectForm } from '../../select/groupSelectForm';
import { DatePickerForm } from '../../datePicker/datePickerForm';
import { RadioForm } from '../../radio/radioForm';
import { MultiRadioForm } from '../../radio/multiRadioForm';

export const Form = forwardRef<FormRef, FormProps>(
  (
    {
      data,
      onChangeDate,
      onChangeText,
      onChangeTextSearch,
      onPaging,
      onSelected,
      onFocus,
      onBlur,
    },
    ref,
  ) => {
    const resetError = (index?: number) => {
      if (typeof index === 'number') {
        data[index].error = '';
      }
    };

    useImperativeHandle(ref, () => ({
      resetError,
    }));

    const renderItem = (item: FormItemsProps, index: number) => {
      if (item.isShow === false) {
        return null;
      }

      switch (item.type) {
        case 'SELECT':
          return (
            <SelectForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onChangeText={onChangeText}
              onChangeTextSearch={onChangeTextSearch}
              onPaging={onPaging}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        case 'INPUT':
          return (
            <InputForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onChangeText={onChangeText}
              onChangeTextSearch={onChangeTextSearch}
              onPaging={onPaging}
              onSelected={onSelected}
              resetError={() => resetError(index)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          );
        case 'DATE':
        case 'YEAR':
        case 'MONTH_YEAR':
          return (
            <DatePickerForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onChangeDate={onChangeDate}
              onChangeText={onChangeText}
              onChangeTextSearch={onChangeTextSearch}
              onPaging={onPaging}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        case 'MULTI_SELECT':
          return (
            <SelectMultiForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onChangeText={onChangeText}
              onChangeTextSearch={onChangeTextSearch}
              onPaging={onPaging}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        case 'GROUP_SELECT':
          return (
            <GroupSelectForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onChangeText={onChangeText}
              onChangeTextSearch={onChangeTextSearch}
              onPaging={onPaging}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        case 'RADIO':
        case 'GROUPRADIO':
          return (
            <RadioForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        case 'MULTI_RADIO':
          return (
            <MultiRadioForm
              key={item.key}
              data={data}
              index={index}
              item={item}
              onSelected={onSelected}
              resetError={() => resetError(index)}
            />
          );
        default:
          return null;
      }
    };

    const groupedData = data.reduce<
      Record<string, Array<{ item: FormItemsProps; index: number }>>
    >((groups, item, index) => {
      if (item.isShow === false) {
        return groups;
      }

      const groupKey = item.row ?? `single-${index}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push({ item, index });

      return groups;
    }, {});

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          {/* {data.map(renderItem)} */}
          {Object.values(groupedData).map((items, groupIndex) => {
            const isRow = items.length > 1;

            return (
              <View key={groupIndex} style={isRow ? styles.row : undefined}>
                {items.map(({ item, index }) => (
                  <View
                    key={item.key}
                    style={
                      isRow
                        ? [styles.column, { flex: item.flex ?? 1 }]
                        : [styles.item]
                    }
                  >
                    {renderItem(item, index)}
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
});
