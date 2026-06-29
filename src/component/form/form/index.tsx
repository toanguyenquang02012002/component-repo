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

export const Form = forwardRef<FormRef, FormProps>(
  ({ data, onChangeText, onChangeTextSearch, onPaging, onSelected }, ref) => {
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
            <View style={styles.item} key={item.key}>
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
            </View>
          );
        case 'INPUT':
          return (
            <View style={styles.item} key={item.key}>
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
              />
            </View>
          );
        case 'MULTI_SELECT':
          return (
            <View style={styles.item} key={item.key}>
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
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>{data.map(renderItem)}</View>
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
});
