import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BottomSheetContext } from '../bottomsheet';

export interface BottomSheetScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function BottomSheetScrollView({
  children,
  style,
  contentContainerStyle,
}: BottomSheetScrollViewProps): React.ReactElement {
  const { notifyAtTop, contentPanGesture } = useContext(BottomSheetContext);

  const nativeScrollGesture = useMemo(() => {
    const native = Gesture.Native();
    if (contentPanGesture) {
      // native.simultaneousWithExternalGesture(contentPanGesture);
      native.requireExternalGestureToFail(contentPanGesture);
    }
    return native;
  }, [contentPanGesture]);

  return (
    <GestureDetector gesture={nativeScrollGesture}>
      <ScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        onScroll={event => {
          notifyAtTop(event.nativeEvent.contentOffset.y <= 0);
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </GestureDetector>
  );
}
