import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { BottomSheet } from '../../bottomsheet';
import {
  clampDate,
  DatePickerType,
  formatDateValue,
  formatDisplayValue,
  getDayList,
  getDayValue,
  getMonthYearValue,
  getYearList,
  MONTHS,
  parseDate,
} from './common';
import { BottomSheetRef } from '../../bottomsheet/bottomsheet/interface';

export type { DatePickerType } from './common';

const { Picker } = require('react-native-wheel-pick');

export interface DatePickerComponentProps {
  label: string;
  onChangeDate?: (date?: Date | string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  disabled?: boolean;
  type: DatePickerType;
  minDate?: Date | number | string;
  value?: Date | string;
  maxDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  isHasSelectOld?: boolean;
  snapHeight?: number;
  keyboardVerticalOffset?: number;
}

export const DatePickerComponent = ({
  label,
  containerStyle,
  error,
  disabled,
  type,
  onChangeDate,
  minDate,
  value,
  maxDate,
  mode = 'date',
  isHasSelectOld = false,
  snapHeight = 360,
  keyboardVerticalOffset = 96,
}: DatePickerComponentProps) => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { width } = useWindowDimensions();
  const monthYearValue = useMemo(() => getMonthYearValue(value), [value]);
  const dayValue = useMemo(() => getDayValue(value), [value]);

  const [valueDate, setValueDate] = useState<Date | string | undefined>(value);
  const [valueTmp, setValueTmp] = useState<Date | string>(
    formatDateValue(new Date(), type, mode),
  );
  const [tmpDay, setTmpDay] = useState(dayValue.day);
  const [tmpMonth, setTmpMonth] = useState(monthYearValue.month);
  const [tmpYear, setTmpYear] = useState(monthYearValue.year);
  const [isChange, setIsChange] = useState(false);
  const yearCenter = useRef(
    Number(tmpYear) || new Date().getFullYear(),
  ).current;

  const placeholder = `Chọn ${label.toLowerCase()}`;
  const displayValue = formatDisplayValue(valueDate, type, mode);

  const pickerWidth = Math.min(Math.max(width - 24, 320), 430);
  const dayColumnWidth = pickerWidth * 0.28;
  const monthColumnWidth = pickerWidth * 0.38;
  const yearColumnWidth = pickerWidth * 0.34;

  useEffect(() => {
    setValueDate(value);
    const nextDate = parseDate(value) ?? new Date();
    const nextMonthYear = getMonthYearValue(value);
    const nextDay = getDayValue(value);
    setValueTmp(formatDateValue(nextDate, type, mode));
    setTmpDay(nextDay.day);
    setTmpMonth(nextMonthYear.month);
    setTmpYear(nextMonthYear.year);
    setIsChange(false);
  }, [mode, type, value]);

  const minimumDate = useMemo(() => parseDate(minDate), [minDate]);

  const dayList = useMemo(
    () => getDayList(tmpMonth, tmpYear),
    [tmpMonth, tmpYear],
  );
  useEffect(() => {
    if (!dayList.some(item => item.value === tmpDay)) {
      setTmpDay(dayList[dayList.length - 1].value);
    }
  }, [dayList, tmpDay]);
  const yearList = useMemo(() => getYearList(yearCenter), [yearCenter]);

  const openSheet = useCallback(() => {
    if (disabled) {
      return;
    }

    Keyboard.dismiss();
    bottomSheetRef.current?.open();
  }, [disabled]);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsChange(false);
  }, []);

  const submitValue = useCallback(
    (nextValue: Date | string) => {
      setValueDate(nextValue);
      onChangeDate?.(nextValue);
      bottomSheetRef.current?.close();
      setIsChange(false);
    },
    [onChangeDate],
  );

  const handleSubmit = useCallback(() => {
    if (type === 'year') {
      submitValue(valueTmp.toString());
      return;
    }

    if (type === 'month_year') {
      submitValue(`${tmpMonth}, ${tmpYear}`);
      return;
    }

    const selectedDay = moment(
      `${tmpYear}-${tmpMonth}-${tmpDay}`,
      'YYYY-MM-DD',
    ).toDate();
    const nextDate = clampDate(selectedDay, minimumDate, maxDate);

    if (
      isHasSelectOld &&
      !isChange &&
      moment(nextDate).isBefore(moment(), 'day')
    ) {
      submitValue(formatDateValue(new Date(), type, mode));
      return;
    }

    submitValue(formatDateValue(nextDate, type, mode));
  }, [
    isChange,
    isHasSelectOld,
    maxDate,
    minimumDate,
    mode,
    submitValue,
    tmpDay,
    tmpMonth,
    tmpYear,
    type,
    valueTmp,
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.82}
        disabled={disabled}
        onPress={openSheet}
        style={[
          styles.dateButton,
          disabled && styles.dateButtonDisabled,
          error && styles.dateButtonError,
          containerStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.dateText,
            !displayValue && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {displayValue || placeholder}
        </Text>
        <Text style={[styles.calendarIcon, disabled && styles.disabledText]}>
          ▾
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet
        ref={bottomSheetRef}
        keyboardVerticalOffset={keyboardVerticalOffset}
        snapHeight={snapHeight}
        style={styles.sheet}
      >
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={closeSheet}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>×</Text>
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.sheetTitle}>
            {placeholder}
          </Text>
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={handleSubmit}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          {type === 'day' ? (
            <View style={styles.dayRow}>
              <Picker
                itemHeight={32}
                pickerData={dayList}
                selectedValue={tmpDay}
                selectTextColor="#111827"
                // textColor="#6B7280"
                // textSize={16}
                itemStyle={styles.wheelPickerItem}
                themeVariant="light"
                textColor="#111827"
                style={[styles.wheelPicker, { width: dayColumnWidth }]}
                onValueChange={(nextValue: string) => {
                  setIsChange(true);
                  setTmpDay(nextValue);
                }}
              />
              <Picker
                itemHeight={32}
                pickerData={MONTHS}
                selectedValue={tmpMonth}
                selectTextColor="#111827"
                // textColor="#6B7280"
                // textSize={16}
                itemStyle={styles.wheelPickerItem}
                themeVariant="light"
                textColor="#111827"
                style={[styles.wheelPicker, { width: monthColumnWidth }]}
                onValueChange={(nextValue: string) => {
                  setIsChange(true);
                  setTmpMonth(nextValue);
                }}
              />
              <Picker
                pickerData={yearList}
                selectedValue={tmpYear}
                selectTextColor="#111827"
                // textColor="#6B7280"
                // textSize={16}
                itemStyle={styles.wheelPickerItem}
                themeVariant="light"
                textColor="#111827"
                style={[styles.wheelPicker, { width: yearColumnWidth }]}
                onValueChange={(nextValue: string) => {
                  setIsChange(true);
                  setTmpYear(nextValue);
                }}
              />
            </View>
          ) : type === 'year' ? (
            <Picker
              pickerData={yearList}
              selectedValue={valueTmp.toString()}
              itemStyle={styles.wheelPickerItem}
              themeVariant="light"
              textColor="#111827"
              textSize={16}
              style={[styles.wheelPicker, { width: pickerWidth }]}
              onValueChange={(nextValue: string) => {
                setValueTmp(nextValue);
              }}
            />
          ) : (
            <View style={styles.monthYearRow}>
              <Picker
                itemHeight={32}
                pickerData={MONTHS}
                selectedValue={tmpMonth}
                itemStyle={styles.wheelPickerItem}
                themeVariant="light"
                textColor="#111827"
                textSize={16}
                style={[styles.wheelPicker, { width: pickerWidth / 2 }]}
                onValueChange={(nextValue: string) => {
                  setTmpMonth(nextValue);
                }}
              />
              <Picker
                pickerData={yearList}
                selectedValue={tmpYear}
                itemStyle={styles.wheelPickerItem}
                themeVariant="light"
                textColor="#111827"
                textSize={16}
                style={[styles.wheelPicker, { width: pickerWidth / 2 }]}
                onValueChange={(nextValue: string) => {
                  setTmpYear(nextValue);
                }}
              />
            </View>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 53, 128, 0.12)',
  },
  dateButton: {
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
  dateButtonDisabled: {
    backgroundColor: 'rgba(0, 53, 128, 0.04)',
  },
  dateButtonError: {
    borderColor: 'red',
  },
  dateText: {
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
  calendarIcon: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: 18,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  sheetHeader: {
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 53, 128, 0.12)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 48,
  },
  headerButtonText: {
    color: '#111827',
    fontSize: 26,
    lineHeight: 28,
  },
  sheetTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmButton: {
    alignItems: 'center',
    minWidth: 76,
    paddingVertical: 8,
  },
  confirmText: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
  },
  pickerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  monthYearRow: {
    flexDirection: 'row',
  },
  dayRow: {
    flexDirection: 'row',
  },
  wheelPicker: {
    backgroundColor: '#FFFFFF',
    height: 240,
  },
  wheelPickerItem: {
    color: '#111827',
    fontSize: 16,
  },
});
