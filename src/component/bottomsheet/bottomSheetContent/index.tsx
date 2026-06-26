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
  const { notifyAtTop } = useContext(BottomSheetContext);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isAtTopRef = useRef(true);

  // const onScroll = useCallback(
  //   (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     const y = event.nativeEvent.contentOffset.y;
  //     const atTop = y <= 0;
  //     if (atTop !== isAtTopRef.current) {
  //       isAtTopRef.current = atTop;
  //       notifyAtTop(atTop);
  //       setScrollEnabled(!atTop);
  //     }
  //   },
  //   [notifyAtTop],
  // );

  const onTouchStart = useCallback(() => {
    if (isAtTopRef.current && !scrollEnabled) {
      setScrollEnabled(true);
    }
  }, [scrollEnabled]);

  return (
    <ScrollView
      {...rest}
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={scrollEnabled}
      // onScroll={onScroll}
      onTouchStart={onTouchStart}
      scrollEventThrottle={16}
      bounces={false}
      overScrollMode="never"
    >
      {children}
    </ScrollView>
  );
}
