import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetRef,
} from '../../bottomsheet';
import { ItemSelectProduct, SelectMultiProps } from '../select/entity';
import { ActivityIndicator } from 'react-native-paper';

const DEFAULT_SHEET_HEIGHT = 520;
export const SelectMulti = ({
  label,
  itemSelected,
  onSelected,
  containerStyle,
  data = [],
  error,
  disabled,
  isPaging,
  onPaging,
  isLoadmore,
  selectStyle,
  searchBox,
  onChangeTextSearch,
  textSearch,
  unit,
  filterOption,
  loading,
  isHighlightCopy,
  textStyle,
  searchInputStyle,
  snapHeight = DEFAULT_SHEET_HEIGHT,
  keyboardVerticalOffset = 96,
  maxSelected,
  submitMode = 'immediate',
}: SelectMultiProps) => {
  const refbottomSheet = useRef<BottomSheetRef>(null);
  const [searchValue, setSearchValue] = useState(textSearch ?? '');
  const [valueSelected, setValueSelected] = useState<ItemSelectProduct[]>([]);
  const [draftSelected, setDraftSelected] = useState<ItemSelectProduct[]>([]);

  useEffect(() => {
    setSearchValue(textSearch ?? '');
  }, [textSearch]);

  useEffect(() => {
    if (itemSelected) {
      setValueSelected(itemSelected);
      setDraftSelected(itemSelected);
      return;
    }

    const selectedItem = data.filter(item => item?.isSelected);
    setValueSelected(selectedItem);
    setDraftSelected(selectedItem);
  }, [data, itemSelected]);

  const activeSelected =
    submitMode === 'confirm' ? draftSelected : valueSelected;

  const defaultData = useMemo(() => {
    const mappedData = data.map(item => ({
      ...item,
      isSelected: activeSelected.some(i => i?.value === item?.value),
    }));

    if (!filterOption || !searchValue.trim()) {
      return mappedData;
    }

    const normalizedSearch = searchValue.trim().toLowerCase();
    return mappedData.filter(item =>
      item.name.toLowerCase().includes(normalizedSearch),
    );
  }, [activeSelected, data, filterOption, searchValue]);

  const placeholder = `Chọn ${label?.toLowerCase() || ''}`;
  const displayValue = valueSelected.length
    ? valueSelected.map(item => item.name).join(', ')
    : `Chọn ${label?.toLowerCase() || ''}`;

  const openSheet = useCallback(() => {
    if (disabled) {
      return;
    }

    Keyboard.dismiss();
    setDraftSelected(valueSelected);
    refbottomSheet.current?.open();
  }, [disabled, valueSelected]);

  const clearSelected = useCallback(() => {
    Keyboard.dismiss();
    setValueSelected([]);
    setDraftSelected([]);
    onSelected?.([]);
  }, [onSelected]);

  const selectItem = useCallback(
    (item: ItemSelectProduct) => {
      if (item.canPress === false) {
        return;
      }

      Keyboard.dismiss();
      const updateSelected = (prev: ItemSelectProduct[]) => {
        const existed = prev.some(i => i.value === item.value);
        if (!existed && maxSelected && prev.length >= maxSelected) {
          return prev;
        }
        const nextSelected = existed
          ? prev.filter(i => i.value !== item.value)
          : [...prev, { ...item, isSelected: true }];

        if (submitMode === 'immediate') {
          onSelected?.(nextSelected);
        }
        return nextSelected;
      };

      if (submitMode === 'confirm') {
        setDraftSelected(updateSelected);
        return;
      }

      setValueSelected(updateSelected);
    },
    [maxSelected, onSelected, submitMode],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onChangeTextSearch?.(value);
    },
    [onChangeTextSearch],
  );

  const handleEndReached = useCallback(() => {
    if (isPaging && !isLoadmore && !loading) {
      onPaging?.();
    }
  }, [isLoadmore, isPaging, loading, onPaging]);

  const renderItem = useCallback(
    ({ item }: { item: ItemSelectProduct }) => {
      const isSelected =
        activeSelected.some(i => i.value === item.value) || item.isSelected;
      const isDisabledItem = item.canPress === false;

      return (
        <TouchableOpacity
          activeOpacity={0.82}
          disabled={isDisabledItem}
          onPress={() => selectItem(item)}
          style={[
            styles.item,
            isSelected && styles.itemSelected,
            item.canPress === false && styles.itemDisabled,
          ]}
        >
          <Text
            numberOfLines={2}
            style={[
              styles.itemText,
              isSelected && styles.itemTextSelected,
              item.canPress === false && styles.itemTextDisabled,
            ]}
          >
            {item.name}
            {unit ? ` ${unit}` : ''}
          </Text>
          {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
        </TouchableOpacity>
      );
    },
    [activeSelected, selectItem, unit],
  );

  const keyExtractor = useCallback(
    (item: ItemSelectProduct, index: number) =>
      `${item.id ?? item.value ?? index}`,
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        {loading ? (
          <ActivityIndicator color="#2563EB" size="small" />
        ) : (
          <Text style={styles.emptyText}>Không có dữ liệu</Text>
        )}
      </View>
    ),
    [loading],
  );

  const renderFooter = useCallback(() => {
    if (!loading && !isLoadmore) {
      return null;
    }

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator color="#2563EB" size="small" />
      </View>
    );
  }, [isLoadmore, loading]);
  return (
    <View style={[styles.container, selectStyle]}>
      <TouchableOpacity
        activeOpacity={0.82}
        disabled={disabled}
        onPress={openSheet}
        style={[
          styles.selectButton,
          containerStyle,
          disabled && styles.selectButtonDisabled,
          isHighlightCopy && !disabled && styles.selectButtonHighlight,
          error && styles.selectButtonError,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.selectText,
            // !valueSelected?.name && styles.placeholderText,
            styles.placeholderText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {displayValue}
        </Text>
        {valueSelected?.length && !disabled ? (
          <TouchableOpacity
            activeOpacity={0.72}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={clearSelected}
            style={styles.clearButton}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.chevron, disabled && styles.disabledText]}>
            ▾
          </Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet
        ref={refbottomSheet}
        keyboardVerticalOffset={keyboardVerticalOffset}
        snapHeight={snapHeight}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{placeholder}</Text>
          {searchBox ? (
            <TextInput
              autoCorrect={false}
              onChangeText={handleSearchChange}
              placeholder={`Tìm ${label?.toLowerCase() || ''}`}
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={[styles.searchInput, searchInputStyle]}
              value={searchValue}
            />
          ) : null}
        </View>

        <BottomSheetFlatList
          data={defaultData}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.35}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.sheetContent,
            submitMode === 'confirm' && styles.sheetContentWithFooter,
            defaultData.length === 0 && styles.sheetContentEmpty,
          ]}
        />
        {submitMode === 'confirm' ? (
          <View style={styles.footerAbsolute}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                refbottomSheet.current?.close();
                setValueSelected(draftSelected);
                onSelected?.(draftSelected);
              }}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 53, 128, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  selectButtonDisabled: {
    backgroundColor: 'rgba(0, 53, 128, 0.04)',
  },
  selectButtonHighlight: {
    backgroundColor: '#FFF7D6',
  },
  selectButtonError: {
    borderColor: 'red',
  },
  selectText: {
    color: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  placeholderText: {
    color: 'rgba(0, 0, 0, 0.4)',
  },
  disabledText: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
  clearButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  clearIcon: {
    color: 'rgba(0, 0, 0, 0.55)',
    fontSize: 22,
    lineHeight: 24,
  },
  chevron: {
    color: 'rgba(0, 0, 0, 0.25)',
    fontSize: 18,
    marginLeft: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  sheetHeader: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8,
    borderWidth: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: 44,
    paddingHorizontal: 12,
  },
  sheetContent: {
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
  sheetContentWithFooter: {
    paddingBottom: 112,
  },
  sheetContentEmpty: {
    flexGrow: 1,
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemSelected: {
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderColor: 'rgba(96,165,250,0.55)',
  },
  itemDisabled: {
    opacity: 0.46,
  },
  itemText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  itemTextSelected: {
    fontWeight: '700',
  },
  itemTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
  checkMark: {
    color: '#93C5FD',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 260,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 15,
  },
  footerLoading: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerAbsolute: {
    backgroundColor: 'rgba(15,10,26,0.98)',
    borderTopColor: 'rgba(255,255,255,0.10)',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
