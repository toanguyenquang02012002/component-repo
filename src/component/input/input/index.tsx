import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextFieldProps } from './entity';

export const Input = ({
  containerStyle,
  editable = true,
  error,
  value,
  label,
  onChangeText,
  keyboardType = 'default',
  multiline,
  onBlur,
  onFocus,
  rightView,
  onPressRight,
  autoCapitalize = 'none',
  maxLength,
  showUnit,
  unit,
  placeholder,
  rightColor,
  isHighlightCopy,
  rightIcon,
  showBorder = true,
  showbgcl = true,
  xheight,
  style,
  ...textInputProps
}: TextFieldProps) => {
  const [valueInput, setValueInput] = useState(value?.toString() ?? '');
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setValueInput(value?.toString() ?? '');
  }, [value]);

  return (
    <>
      <View
        style={[
          styles.container,
          showBorder ? styles.containerBorder : styles.containerNoBorder,
          showbgcl && !editable && styles.containerDisabled,
          showbgcl && isHighlightCopy && editable && styles.containerHighlight,
          error && styles.containerError,
          containerStyle,
        ]}
      >
        <TextInput
          {...textInputProps}
          autoCapitalize={autoCapitalize}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onBlur={onBlur}
          onChangeText={txt => {
            setValueInput(txt);
            onChangeText?.(txt);
          }}
          onContentSizeChange={event => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
          onFocus={onFocus}
          placeholder={
            placeholder ?? (editable ? `Nhập ${label.toLowerCase()}` : '')
          }
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          style={[
            styles.textInput,
            !editable && styles.textInputDisabled,
            multiline && {
              height: Math.max(52 + 52 * (xheight ?? 1), height),
              maxHeight: 208,
              textAlignVertical: 'top',
            },
            style,
          ]}
          value={valueInput}
        />

        {showUnit ? <Text style={styles.unitText}>{unit ?? '%'}</Text> : null}

        {rightView ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPressRight}
            style={styles.rightView}
          >
            {typeof rightView === 'string' ? (
              <Text
                style={[
                  styles.rightText,
                  rightColor ? { color: rightColor } : null,
                ]}
              >
                {rightView}
              </Text>
            ) : (
              rightIcon ?? <Text style={styles.rightText}>›</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 53, 128, 0.2)',
    borderRadius: 8,
    flexDirection: 'row',
    minHeight: 52,
  },
  containerBorder: {
    borderWidth: 1,
  },
  containerNoBorder: {
    borderWidth: 0,
  },
  containerDisabled: {
    backgroundColor: 'rgba(0, 53, 128, 0.04)',
  },
  containerHighlight: {
    backgroundColor: '#fff3d1',
  },
  containerError: {
    borderColor: 'red',
  },
  textInput: {
    color: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    fontSize: 14,
    minHeight: 52,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textInputDisabled: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
  unitText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 14,
    paddingRight: 16,
  },
  rightView: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderLeftColor: 'rgba(0, 53, 128, 0.2)',
    borderLeftWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  rightText: {
    color: '#366AE2',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
});
