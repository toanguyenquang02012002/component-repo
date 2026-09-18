import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ItemSelectProduct } from '../../select/select/entity';
import { MultiRadioProps } from '../entity';

const DEFAULT_ACTIVE_COLOR = '#2563EB';

export function MultiRadio<T extends ItemSelectProduct>({
  data = [],
  itemSelected = [],
  onSelected,
  label,
  disabled = false,
  error,
  horizontal = false,
  activeColor = DEFAULT_ACTIVE_COLOR,
  maxSelected,
  minSelected = 0,
  containerStyle,
  optionStyle,
  labelStyle,
}: MultiRadioProps<T>): React.ReactElement {
  const toggleOption = useCallback(
    (option: T) => {
      if (disabled || option.canPress === false) {
        return;
      }

      const checked = itemSelected.some(
        item => item.value === option.value,
      );

      if (checked) {
        if (itemSelected.length <= minSelected) {
          return;
        }

        onSelected?.(
          itemSelected.filter(item => item.value !== option.value),
        );
        return;
      }

      if (
        maxSelected !== undefined &&
        itemSelected.length >= maxSelected
      ) {
        return;
      }

      onSelected?.([...itemSelected, { ...option, isSelected: true }]);
    },
    [disabled, itemSelected, maxSelected, minSelected, onSelected],
  );

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.groupLabel}>{label}</Text> : null}

      <View style={[styles.options, horizontal && styles.optionsHorizontal]}>
        {data.map(option => {
          const checked = itemSelected.some(
            item => item.value === option.value,
          );
          const reachedMaximum =
            !checked &&
            maxSelected !== undefined &&
            itemSelected.length >= maxSelected;
          const reachedMinimum =
            checked && itemSelected.length <= minSelected;
          const optionDisabled =
            disabled ||
            option.canPress === false ||
            reachedMaximum ||
            reachedMinimum;

          return (
            <Pressable
              key={String(option.value)}
              accessibilityLabel={option.name}
              accessibilityRole="checkbox"
              accessibilityState={{ checked, disabled: optionDisabled }}
              disabled={optionDisabled}
              onPress={() => toggleOption(option)}
              style={({ pressed }) => [
                styles.option,
                horizontal && styles.optionHorizontal,
                pressed && styles.optionPressed,
                optionDisabled && styles.optionDisabled,
                optionStyle,
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  checked && {
                    backgroundColor: activeColor,
                    borderColor: activeColor,
                  },
                ]}
              >
                {checked ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>

              <Text
                style={[
                  styles.optionLabel,
                  checked && { color: activeColor },
                  optionDisabled && styles.optionLabelDisabled,
                  labelStyle,
                ]}
              >
                {option.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  options: {
    alignItems: 'flex-start',
  },
  optionsHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 40,
    paddingVertical: 6,
  },
  optionHorizontal: {
    marginRight: 20,
  },
  optionPressed: {
    opacity: 0.65,
  },
  optionDisabled: {
    opacity: 0.45,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  optionLabel: {
    color: 'rgba(0, 0, 0, 0.8)',
    flexShrink: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  optionLabelDisabled: {
    color: 'rgba(0, 0, 0, 0.4)',
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});
