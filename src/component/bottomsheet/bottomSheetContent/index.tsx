import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BottomSheetContext } from '../bottomsheet';

export interface BottomSheetContentProps
  extends Omit<
    ScrollViewProps,
    'onScroll' | 'scrollEventThrottle' | 'bounces' | 'overScrollMode'
  > {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function BottomSheetContent({
  children,
  style,
  contentContainerStyle,
  ...rest
}: BottomSheetContentProps): React.ReactElement {
  return (
    <ScrollView
      {...rest}
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEventThrottle={16}
      bounces={false}
      overScrollMode="never"
    >
      {children}
    </ScrollView>
  );
}
