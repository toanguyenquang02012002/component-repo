import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextFieldProps } from './entity';
import { FloatingField } from '../../common';

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
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setValueInput(value?.toString() ?? '');
  }, [value]);

  const backgroundColor =
    showbgcl && !editable
      ? '#F1F5F9'
      : showbgcl && isHighlightCopy && editable
      ? '#FFF7D6'
      : '#FFFFFF';

  return (
    <>
      <FloatingField
        backgroundColor={backgroundColor}
        disabled={!editable}
        error={error}
        focused={focused}
        label={label}
        style={[
          styles.container,
          !showBorder && styles.containerNoBorder,
          containerStyle,
        ]}
        value={valueInput}
      >
        <View style={styles.inputRow}>
          <TextInput
            {...textInputProps}
            autoCapitalize={autoCapitalize}
            editable={editable}
            keyboardType={keyboardType}
            maxLength={maxLength}
            multiline={multiline}
            onBlur={event => {
              setFocused(false);
              onBlur?.(event);
            }}
            onChangeText={txt => {
              setValueInput(txt);
              onChangeText?.(txt);
            }}
            onContentSizeChange={event => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            onFocus={event => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholder={
              focused
                ? placeholder ?? (editable ? `Nhập ${label.toLowerCase()}` : '')
                : undefined
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
      </FloatingField>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 54,
  },
  containerNoBorder: {
    borderWidth: 0,
  },
  textInput: {
    color: '#0F172A',
    flex: 1,
    fontSize: 15,
    minHeight: 54,
    paddingHorizontal: 14,
    paddingBottom: 8,
    paddingTop: 15,
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
