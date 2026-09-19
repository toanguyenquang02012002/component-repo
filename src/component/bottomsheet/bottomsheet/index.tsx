import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import { Portal } from 'react-native-paper';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CLOSE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 800;

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

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      onClose,
      snapHeight,
      backdropOpacity = 0.5,
      style,
      avoidKeyboard = true,
      keyboardVerticalOffset = 0,
    },
    ref,
  ) => {
    const sheetHeight = snapHeight ?? SCREEN_HEIGHT * 0.6;
    const translateY = useRef(new Animated.Value(sheetHeight)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);
    const animationIdRef = useRef(0);
    const atTopRef = useRef(true);
    const [atTop, setAtTop] = useState(true);
    const visibleRef = useRef(false);

    const notifyAtTop = useCallback((isAtTop: boolean) => {
      atTopRef.current = isAtTop;

      setAtTop(isAtTop);
    }, []);

    const stopRunningAnimations = useCallback(() => {
      translateY.stopAnimation();
      backdropAnim.stopAnimation();
      keyboardOffset.stopAnimation();
    }, [backdropAnim, keyboardOffset, translateY]);

    const close = useCallback(() => {
      if (!visibleRef.current) {
        return;
      }

      const animationId = animationIdRef.current + 1;
      animationIdRef.current = animationId;
      stopRunningAnimations();

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeight,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && animationIdRef.current === animationId) {
          visibleRef.current = false;
          setVisible(false);
          Keyboard.dismiss();
          onClose?.();
        }
      });
    }, [
      backdropAnim,
      keyboardOffset,
      onClose,
      sheetHeight,
      stopRunningAnimations,
      translateY,
    ]);

    const open = useCallback(() => {
      const animationId = animationIdRef.current + 1;
      animationIdRef.current = animationId;
      stopRunningAnimations();
      atTopRef.current = true;
      setAtTop(true);

      if (!visibleRef.current) {
        translateY.setValue(sheetHeight);
        backdropAnim.setValue(0);
        visibleRef.current = true;
        setVisible(true);
      }

      keyboardOffset.setValue(0);

      requestAnimationFrame(() => {
        if (animationIdRef.current !== animationId) {
          return;
        }

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(backdropAnim, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, [
      backdropAnim,
      keyboardOffset,
      sheetHeight,
      stopRunningAnimations,
      translateY,
    ]);

    useEffect(() => {
      if (!visible || !avoidKeyboard) {
        return;
      }

      const showEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const animateKeyboardOffset = (
        toValue: number,
        event?: KeyboardEvent,
      ) => {
        Animated.timing(keyboardOffset, {
          toValue,
          duration: event?.duration ?? 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      };

      const showSubscription = Keyboard.addListener(showEvent, event => {
        const nextOffset = Math.max(
          0,
          event.endCoordinates.height - keyboardVerticalOffset,
        );
        // animateKeyboardOffset(nextOffset, event);
      });
      const hideSubscription = Keyboard.addListener(hideEvent, event => {
        animateKeyboardOffset(0, event);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [avoidKeyboard, keyboardOffset, keyboardVerticalOffset, visible]);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const handlePanGesture = useMemo(
      () =>
        Gesture.Pan()
          .runOnJS(true)
          .activeOffsetY([-5, 5])
          .onUpdate(event => {
            const { translationY: dragY } = event;
            // if (!atTopRef.current) {
            //   translateY.setValue(0);
            //   return;
            // }
            translateY.setValue(Math.max(0, dragY));
          })
          .onEnd(event => {
            // if (!atTopRef.current) {
            //   translateY.setValue(0);
            //   return;
            // }
            const dragY = Math.max(0, event.translationY);
            if (
              dragY > CLOSE_THRESHOLD ||
              event.velocityY > VELOCITY_THRESHOLD
            ) {
              close();
              return;
            }
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              damping: 20,
              stiffness: 300,
            }).start();
          }),
      [close, translateY],
    );
    const contentPanGesture = useMemo(
      () =>
        Gesture.Pan()
          .runOnJS(true)
          .enabled(atTop)
          .activeOffsetY(8)
          .failOffsetY(-8)
          .onUpdate(event => {
            const { translationY: dragY, translationX: dragX } = event;
            // if (!atTopRef.current) {
            //   translateY.setValue(0);
            //   return;
            // }

            // Chỉ cho kéo xuống, không cho kéo lên
            // if (dragX < 0) {
            translateY.setValue(Math.max(0, dragY));
            // }
          })
          .onEnd(event => {
            if (!atTopRef.current) {
              translateY.setValue(0);
              return;
            }

            const dragY = Math.max(0, event.translationY);
            if (
              dragY > CLOSE_THRESHOLD ||
              event.velocityY > VELOCITY_THRESHOLD
            ) {
              close();
              return;
            }

            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              damping: 20,
              stiffness: 300,
            }).start();
          }),
      [atTop, close, translateY],
    );
    if (!visible) {
      return null;
    }

    return (
      <Portal>
        <View
          style={[StyleSheet.absoluteFill, styles.portalContainer]}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback onPress={close}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.backdrop,
                { opacity: Animated.multiply(backdropAnim, backdropOpacity) },
              ]}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.sheet,
              {
                height: sheetHeight,
                transform: [
                  {
                    translateY: Animated.add(
                      translateY.interpolate({
                        inputRange: [0, 10000],
                        outputRange: [0, 10000],
                        extrapolateLeft: 'clamp',
                      }),
                      Animated.multiply(keyboardOffset, -1),
                    ),
                  },
                ],
              },
              style,
            ]}
          >
            <GestureDetector gesture={handlePanGesture}>
              <Animated.View style={styles.handleArea}>
                <View style={styles.handle} />
              </Animated.View>
            </GestureDetector>
            <GestureDetector gesture={contentPanGesture}>
              <Animated.View style={styles.content}>
                <BottomSheetContext.Provider
                  value={{
                    notifyAtTop,
                    contentPanGesture,
                    isScroll: atTopRef.current,
                  }}
                >
                  {children}
                </BottomSheetContext.Provider>
              </Animated.View>
            </GestureDetector>
          </Animated.View>
        </View>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,10,26,0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  content: {
    flex: 1,
  },
  portalContainer: {
    flex: 1,
  },
});
