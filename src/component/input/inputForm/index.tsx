import React, { useState } from 'react';
import { Input } from '../input';
import { FormItemRenderProps } from '../../form/form/entity';

export const InputForm = ({
  index,
  item,
  onChangeText,
  resetError,
  onFocus,
  onBlur,
}: FormItemRenderProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isTextArea = item.type === 'TEXTAREA';
  const isPassword = item.type === 'PASSWORD';
  const keyboardType =
    item.type === 'PHONE'
      ? 'phone-pad'
      : item.type === 'EMAIL'
        ? 'email-address'
        : item.keyboardType;

  return (
    <Input
      autoCapitalize={
        item.type === 'EMAIL' || isPassword
          ? 'none'
          : item.autoCapitalize
      }
      autoComplete={
        item.type === 'EMAIL'
          ? 'email'
          : item.type === 'PHONE'
            ? 'tel'
            : isPassword
              ? 'current-password'
              : undefined
      }
      editable={!item.disabled}
      error={item.error}
      isHighlightCopy={item.isHighlightCopy}
      keyboardType={keyboardType}
      label={item.label}
      maxLength={item.maxLength}
      multiline={isTextArea || item.multiline}
      onChangeText={value => {
        item.isHighlightCopy = false;
        item.value = value;
        onChangeText?.(value, index, item.key);
        resetError?.();
      }}
      onFocus={value => {
        onFocus?.(value, index, item.key);
      }}
      onPressRight={
        isPassword ? () => setShowPassword(current => !current) : undefined
      }
      rightView={isPassword ? (showPassword ? 'Ẩn' : 'Hiện') : undefined}
      secureTextEntry={isPassword && !showPassword}
      onBlur={value => {
        onBlur?.(value, index, item.key);
      }}
      showbgcl={item.showbgcl}
      showBorder={item.showBorder}
      value={
        typeof item.value === 'string' || typeof item.value === 'number'
          ? item.value.toString()
          : ''
      }
      xheight={isTextArea ? 2 : item.multiline ? 1 : undefined}
    />
  );
};
