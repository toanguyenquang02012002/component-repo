import React, { forwardRef, useContext, useMemo } from 'react';
import { FlatList, FlatListProps, StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BottomSheetContext } from '../bottomsheet';

export interface BottomSheetFlatListProps<T>
  extends Omit<FlatListProps<T>, 'style'> {
  style?: StyleProp<ViewStyle>;
}

function BottomSheetFlatListInner<T>(
  { style, ...rest }: BottomSheetFlatListProps<T>,
  ref: React.ForwardedRef<FlatList<T>>,
): React.ReactElement {
  const { notifyAtTop, contentPanGesture } = useContext(BottomSheetContext);

  const nativeScrollGesture = useMemo(() => {
    const native = Gesture.Native();
    if (contentPanGesture) {
      native.simultaneousWithExternalGesture(contentPanGesture);
    }
    return native;
  }, [contentPanGesture]);

  return (
    <GestureDetector gesture={nativeScrollGesture}>
      <FlatList
        ref={ref}
        style={style}
        scrollEventThrottle={16}
        onScroll={event => {
          notifyAtTop(event.nativeEvent.contentOffset.y <= 0);
        }}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </GestureDetector>
  );
}

export const BottomSheetFlatList = forwardRef(BottomSheetFlatListInner) as <T>(
  props: BottomSheetFlatListProps<T> & { ref?: React.ForwardedRef<FlatList<T>> },
) => React.ReactElement;
