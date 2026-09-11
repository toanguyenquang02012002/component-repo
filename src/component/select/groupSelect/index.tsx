import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetRef,
} from '../../bottomsheet';
import {
  ItemSelectProduct,
  SelectGroupConfig,
  SelectGroupValues,
  SelectGroupValue,
} from '../../form/form/entity';

interface GroupSelectProps {
  label: string;
  groups?: SelectGroupConfig[];
  value?: SelectGroupValues;
  error?: string;
  disabled?: boolean;
  isHighlightCopy?: boolean;
  onSubmit?: (value: SelectGroupValues) => void;
}

const getInitialValues = (
  groups: SelectGroupConfig[] = [],
  value?: SelectGroupValues,
): SelectGroupValues => {
  return groups.reduce<SelectGroupValues>((result, group) => {
    const currentValue = value?.[group.key] ?? group.value;
    const selectedFromData = group.data.filter(item => item.isSelected);

    result[group.key] =
      currentValue ??
      (group.mode === 'multi' ? selectedFromData : selectedFromData[0]);

    return result;
  }, {});
};

const getValueLabel = (value: SelectGroupValue) => {
  if (Array.isArray(value)) {
    return value.map(item => item.name).join(', ');
  }

  return value?.name ?? '';
};

const isSelected = (
  group: SelectGroupConfig,
  item: ItemSelectProduct,
  value: SelectGroupValue,
) => {
  if (group.mode === 'multi') {
    return Array.isArray(value) && value.some(i => i.value === item.value);
  }

  return !Array.isArray(value) && value?.value === item.value;
};

const getSelectedCount = (value: SelectGroupValue) => {
  if (Array.isArray(value)) {
    return value.length;
  }

  return value ? 1 : 0;
};

export const GroupSelect = ({
  label,
  groups = [],
  value,
  error,
  disabled,
  isHighlightCopy,
  onSubmit,
}: GroupSelectProps) => {
  const refbottomSheet = useRef<BottomSheetRef>(null);
  const listRef = useRef<FlatList<SelectGroupConfig>>(null);
  const [values, setValues] = useState<SelectGroupValues>(() =>
    getInitialValues(groups, value),
  );
  const [draftValues, setDraftValues] = useState<SelectGroupValues>(() =>
    getInitialValues(groups, value),
  );
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextValues = getInitialValues(groups, value);
    setValues(nextValues);
    setDraftValues(nextValues);
  }, [groups, value]);

  const displayValue = useMemo(() => {
    const labels = groups
      .map(group => getValueLabel(values[group.key]))
      .filter(Boolean);

    return labels.length ? labels.join(' • ') : `Chọn ${label.toLowerCase()}`;
  }, [groups, label, values]);

  const onPressItem = (group: SelectGroupConfig, item: ItemSelectProduct) => {
    if (item.canPress === false) {
      return;
    }

    setDraftValues(prev => {
      if (group.mode === 'single') {
        return {
          ...prev,
          [group.key]: { ...item, isSelected: true },
        };
      }

      const current = Array.isArray(prev[group.key])
        ? (prev[group.key] as ItemSelectProduct[])
        : [];
      const existed = current.some(i => i.value === item.value);
      const next = existed
        ? current.filter(i => i.value !== item.value)
        : group.maxSelected && current.length >= group.maxSelected
        ? current
        : [...current, { ...item, isSelected: true }];

      return {
        ...prev,
        [group.key]: next,
      };
    });

    if (groupErrors[group.key]) {
      setGroupErrors(prev => {
        const next = { ...prev };
        delete next[group.key];
        return next;
      });
    }
  };

  const validateDraftValues = () => {
    const nextErrors: Record<string, string> = {};
    const firstInvalidIndex = groups.findIndex(group => {
      const minSelected = group.minSelected ?? (group.required ? 1 : 0);
      if (!minSelected) {
        return false;
      }

      const selectedCount = getSelectedCount(draftValues[group.key]);
      const isInvalid = selectedCount < minSelected;
      if (isInvalid) {
        nextErrors[group.key] =
          minSelected === 1
            ? `Vui lòng chọn ít nhất 1 ${group.label.toLowerCase()}`
            : `Vui lòng chọn ít nhất ${minSelected} ${group.label.toLowerCase()}`;
      }

      return isInvalid;
    });

    setGroupErrors(nextErrors);

    if (firstInvalidIndex >= 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          animated: true,
          index: firstInvalidIndex,
          viewPosition: 0,
        });
      });
      return false;
    }

    return true;
  };

  const clearValue = () => {
    const nextValues = groups.reduce<SelectGroupValues>((result, group) => {
      result[group.key] = group.mode === 'multi' ? [] : undefined;
      return result;
    }, {});

    setValues(nextValues);
    setDraftValues(nextValues);
    onSubmit?.(nextValues);
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.82}
        disabled={disabled}
        onPress={() => {
          Keyboard.dismiss();
          setDraftValues(values);
          refbottomSheet.current?.open();
        }}
        style={[
          styles.selectButton,
          disabled && styles.selectButtonDisabled,
          isHighlightCopy && !disabled && styles.selectButtonHighlight,
          error && styles.selectButtonError,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.selectText,
            displayValue.startsWith('Chọn') && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {displayValue}
        </Text>
        {displayValue.startsWith('Chọn') || disabled ? (
          <Text style={[styles.chevron, disabled && styles.disabledText]}>
            ▾
          </Text>
        ) : (
          <TouchableOpacity
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={clearValue}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet
        ref={refbottomSheet}
        keyboardVerticalOffset={96}
        snapHeight={620}
      >
        <View style={styles.sheetWrapper}>
          <View style={styles.sheetHeader}>
            <Text
              style={styles.sheetTitle}
            >{`Chọn ${label.toLowerCase()}`}</Text>
          </View>

          <BottomSheetFlatList
            ref={listRef}
            data={groups}
            keyExtractor={item => item.key}
            keyboardShouldPersistTaps="handled"
            onScrollToIndexFailed={info => {
              listRef.current?.scrollToOffset({
                animated: true,
                offset: Math.max(0, info.averageItemLength * info.index),
              });
            }}
            contentContainerStyle={styles.sheetContent}
            renderItem={({ item: group }) => (
              <View style={styles.groupBlock}>
                <Text style={styles.groupTitle}>
                  {group.label}
                  {group.mode === 'multi' && group.maxSelected
                    ? ` (${
                        getValueLabel(draftValues[group.key])
                          .split(',')
                          .filter(Boolean).length
                      }/${group.maxSelected})`
                    : ''}
                </Text>
                {groupErrors[group.key] ? (
                  <Text style={styles.groupError}>
                    {groupErrors[group.key]}
                  </Text>
                ) : null}
                {group.data.map(option => {
                  const selected = isSelected(
                    group,
                    option,
                    draftValues[group.key],
                  );
                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.82}
                      disabled={option.canPress === false}
                      onPress={() => onPressItem(group, option)}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                        option.canPress === false && styles.optionDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {option.name}
                      </Text>
                      {selected ? (
                        <Text style={styles.checkMark}>✓</Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />

          <View style={styles.footerAbsolute}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                if (!validateDraftValues()) {
                  return;
                }

                refbottomSheet.current?.close();
                setValues(draftValues);
                onSubmit?.(draftValues);
              }}
              style={styles.applyButton}
            >
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#fff3d1',
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
  sheetWrapper: {
    flex: 1,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetContent: {
    paddingBottom: 112,
    paddingHorizontal: 20,
  },
  groupBlock: {
    marginBottom: 18,
  },
  groupTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  groupError: {
    color: '#FCA5A5',
    fontSize: 13,
    marginBottom: 10,
  },
  option: {
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
  optionSelected: {
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderColor: 'rgba(96,165,250,0.55)',
  },
  optionDisabled: {
    opacity: 0.46,
  },
  optionText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  checkMark: {
    color: '#93C5FD',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
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
    minHeight: 48,
    justifyContent: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
