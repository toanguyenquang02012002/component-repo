import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { FormItemsProps, FormProps, FormRef } from './entity';
import { fieldRegistry } from './fieldRegistry';

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

      const FieldComponent = fieldRegistry[item.type];

      if (!FieldComponent) {
        if (__DEV__) {
          console.warn(`Chưa đăng ký component cho field type: ${item.type}`);
        }

        return null;
      }

      return (
        <FieldComponent
          data={data}
          index={index}
          item={item}
          onChangeDate={onChangeDate}
          onChangeText={onChangeText}
          onChangeTextSearch={onChangeTextSearch}
          onPaging={onPaging}
          onSelected={onSelected}
          onFocus={onFocus}
          onBlur={onBlur}
          resetError={() => resetError(index)}
        />
      );
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
                        : styles.item
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
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
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
