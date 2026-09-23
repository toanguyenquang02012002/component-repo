import React, { forwardRef, useContext, useMemo, useRef } from 'react';
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
  const { notifyAtTop, contentPanGesture, isScroll } =
    useContext(BottomSheetContext);
  const layoutFirstInit = useRef<number>(0);

  const nativeScrollGesture = useMemo(() => {
    const native = Gesture.Native();
    if (contentPanGesture && isScroll) {
      // native.simultaneousWithExternalGesture(contentPanGesture);
      native.requireExternalGestureToFail(contentPanGesture);
    }
    return native;
  }, [contentPanGesture, isScroll]);

  return (
    <GestureDetector gesture={nativeScrollGesture}>
      <FlatList
        ref={ref}
        style={style}
        onLayout={e => {
          const { height } = e.nativeEvent.layout;
          if (layoutFirstInit?.current == 0) {
            layoutFirstInit.current = height;
          }
        }}
        scrollEventThrottle={16}
        onScroll={event => {
          notifyAtTop(event.nativeEvent.contentOffset.y <= 0);
        }}
        showsVerticalScrollIndicator={false}
        {...rest}
        // renderItem={() => <></>}
      />
    </GestureDetector>
  );
}

export const BottomSheetFlatList = forwardRef(BottomSheetFlatListInner) as <T>(
  props: BottomSheetFlatListProps<T> & {
    ref?: React.ForwardedRef<FlatList<T>>;
  },
) => React.ReactElement;
