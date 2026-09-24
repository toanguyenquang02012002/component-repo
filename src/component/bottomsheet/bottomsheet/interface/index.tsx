import { createContext } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { GestureType } from 'react-native-gesture-handler';

interface BottomSheetContextValue {
  notifyAtTop: (isAtTop: boolean) => void;
  // notifyDraggingSheet: (isDragging: boolean) => void;
  contentPanGesture: GestureType | null;
  // isDraggingSheet: boolean;
  isScroll: boolean;
}

export const BottomSheetContext = createContext<BottomSheetContextValue>({
  notifyAtTop: () => {},
  // notifyDraggingSheet: () => {},
  contentPanGesture: null,
  // isDraggingSheet: false,
  isScroll: true,
});

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface BottomSheetProps {
  children: React.ReactNode;
  onClose?: () => void;
  snapHeight?: number;
  backdropOpacity?: number;
  style?: StyleProp<ViewStyle>;
  avoidKeyboard?: boolean;
  keyboardVerticalOffset?: number;
}
