import React, { useContext } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ScrollView as RNGHScrollView } from 'react-native-gesture-handler';
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
  const { notifyAtTop, dragHandlerRef } = useContext(BottomSheetContext);

  return (
    <RNGHScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEventThrottle={16}
      simultaneousHandlers={dragHandlerRef}
      onScroll={event => {
        console.log(event.nativeEvent.contentOffset.y <= 0);

        notifyAtTop(event.nativeEvent.contentOffset.y <= 0);
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </RNGHScrollView>
  );
}
