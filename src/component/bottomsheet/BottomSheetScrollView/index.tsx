import React, { forwardRef, useContext, useMemo } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BottomSheetContext } from '../bottomsheet/interface';

export interface BottomSheetScrollViewProps
  extends Omit<ScrollViewProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BottomSheetScrollView = forwardRef<
  ScrollView,
  BottomSheetScrollViewProps
>(({ children, style, contentContainerStyle, onScroll, ...rest }, ref) => {
  const { notifyAtTop, contentPanGesture, isScroll } =
    useContext(BottomSheetContext);

  const nativeScrollGesture = useMemo(() => {
    const native = Gesture.Native();
    if (contentPanGesture && isScroll) {
      native.requireExternalGestureToFail(contentPanGesture);
    }
    return native;
  }, [contentPanGesture, isScroll]);

  return (
    <GestureDetector gesture={nativeScrollGesture}>
      <ScrollView
        ref={ref}
        style={style}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        onScroll={event => {
          notifyAtTop(event.nativeEvent.contentOffset.y <= 0);
          onScroll?.(event);
        }}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </GestureDetector>
  );
});
