import React, {
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
  KeyboardAvoidingView,
  KeyboardEvent,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Portal } from 'react-native-paper';
import {
  BottomSheetContext,
  BottomSheetProps,
  BottomSheetRef,
} from './interface';

export type { BottomSheetProps, BottomSheetRef } from './interface';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CLOSE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 800;

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
    const sheetHeight = snapHeight || SCREEN_HEIGHT * 0.8;
    // const sheetHeight = SCREEN_HEIGHT * 0.8;
    const translateY = useRef(new Animated.Value(sheetHeight)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const keyboardOverlap = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);
    const animationIdRef = useRef(0);
    const atTopRef = useRef(true);
    const [atTop, setAtTop] = useState(true);
    const visibleRef = useRef(false);
    const windowHeightBeforeKeyboardRef = useRef(
      Dimensions.get('window').height,
    );
    const animatedSheetHeight = useRef(new Animated.Value(sheetHeight)).current;
    const notifyAtTop = useCallback((isAtTop: boolean) => {
      atTopRef.current = isAtTop;

      setAtTop(isAtTop);
    }, []);

    const stopRunningAnimations = useCallback(() => {
      translateY.stopAnimation();
      backdropAnim.stopAnimation();
      keyboardOffset.stopAnimation();
      keyboardOverlap.stopAnimation();
      animatedSheetHeight.stopAnimation();
    }, [
      backdropAnim,
      keyboardOffset,
      keyboardOverlap,
      translateY,
      animatedSheetHeight,
    ]);

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
        Animated.timing(keyboardOverlap, {
          toValue: 0,
          duration: 260,
          useNativeDriver: false,
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
      keyboardOverlap,
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
      windowHeightBeforeKeyboardRef.current = Dimensions.get('window').height;
      animatedSheetHeight.setValue(sheetHeight);

      if (!visibleRef.current) {
        translateY.setValue(sheetHeight);
        backdropAnim.setValue(0);
        visibleRef.current = true;
        setVisible(true);
      }

      keyboardOffset.setValue(0);
      keyboardOverlap.setValue(0);

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
      keyboardOverlap,
      sheetHeight,
      stopRunningAnimations,
      translateY,
    ]);

    //push pop bottomSheet
    const animateKeyboard = useCallback(
      (
        offset: number,
        overlap: number,
        height: number,
        event?: KeyboardEvent,
      ) => {
        Animated.parallel([
          Animated.timing(keyboardOffset, {
            toValue: offset,
            duration: event?.duration ?? 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(keyboardOverlap, {
            toValue: overlap,
            duration: event?.duration ?? 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(animatedSheetHeight, {
            toValue: height,
            duration: 700,
            easing: Easing.in(Easing.step0),

            // Height không hỗ trợ native driver
            useNativeDriver: false,
          }),
        ]).start();
      },
      [animatedSheetHeight, keyboardOffset, keyboardOverlap],
    );

    useEffect(() => {
      if (!visible || !avoidKeyboard) {
        return;
      }

      const showEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSubscription = Keyboard.addListener(showEvent, event => {
        const windowHeight = Dimensions.get('window').height;
        const keyboardHeight = event.endCoordinates.height;

        const availableHeight =
          windowHeightBeforeKeyboardRef.current -
          keyboardHeight -
          keyboardVerticalOffset;

        const nextSheetHeight = Math.max(
          200,
          Math.min(sheetHeight, availableHeight),
        );
        const nextOffset = Platform.OS === 'ios' ? keyboardHeight : 0;
        animateKeyboard(nextOffset, 0, nextSheetHeight, event);
      });
      const hideSubscription = Keyboard.addListener(hideEvent, event => {
        animateKeyboard(0, 0, sheetHeight, event);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [
      animateKeyboard,
      avoidKeyboard,
      keyboardOffset,
      keyboardOverlap,
      keyboardVerticalOffset,
      sheetHeight,
      visible,
    ]);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const handlePanGesture = useMemo(
      () =>
        Gesture.Pan()
          .runOnJS(true)
          .activeOffsetY([-5, 5])
          .onUpdate(event => {
            const { translationY: dragY } = event;
            translateY.setValue(Math.max(0, dragY));
          })
          .onEnd(event => {
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
            const { translationY: dragY } = event;
            translateY.setValue(Math.max(0, dragY));
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              styles.sheetContainer,
              {
                height: animatedSheetHeight,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.sheet,
                {
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
                <Animated.View
                  style={[styles.content, { paddingBottom: keyboardOverlap }]}
                >
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
          </Animated.View>
        </KeyboardAvoidingView>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000',
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
  portalContainer: {
    flex: 1,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  sheet: {
    flex: 1,
    backgroundColor: 'rgba(15,10,26,0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
