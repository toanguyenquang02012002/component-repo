import React, { useCallback, useRef } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetRef,
} from '../../../component';

const TEST_ITEMS = Array.from({ length: 24 }, (_, index) => ({
  id: String(index + 1),
  title: `Bottom sheet item ${index + 1}`,
}));

export function HomeScreen(): React.ReactElement {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const renderItem = useCallback(
    ({ item }: { item: (typeof TEST_ITEMS)[number] }) => (
      <View style={styles.listItem}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        <Text style={styles.listItemSubtitle}>Gesture and scroll test row</Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>
          Tap the button below to test the bottom sheet component.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={openBottomSheet}
          style={({ pressed }) => [
            styles.openButton,
            pressed && styles.openButtonPressed,
          ]}
        >
          <Text style={styles.openButtonText}>Open bottom sheet</Text>
        </Pressable>
      </View>

      <BottomSheet ref={bottomSheetRef} snapHeight={520}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Bottom Sheet</Text>
          <Text style={styles.sheetDescription}>
            Scroll this list, then pull down from the top or drag the handle to
            close.1
          </Text>
        </View>
        <BottomSheetFlatList
          data={TEST_ITEMS}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.sheetContent}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 28,
  },
  openButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  openButtonPressed: {
    opacity: 0.82,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sheetContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sheetDescription: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  listItemTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  listItemSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});
