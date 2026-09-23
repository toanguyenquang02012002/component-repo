import moment from 'moment';

export type DatePickerType = 'day' | 'year' | 'month_year';

export const MONTHS = [
  { label: 'Tháng 1', value: '01' },
  { label: 'Tháng 2', value: '02' },
  { label: 'Tháng 3', value: '03' },
  { label: 'Tháng 4', value: '04' },
  { label: 'Tháng 5', value: '05' },
  { label: 'Tháng 6', value: '06' },
  { label: 'Tháng 7', value: '07' },
  { label: 'Tháng 8', value: '08' },
  { label: 'Tháng 9', value: '09' },
  { label: 'Tháng 10', value: '10' },
  { label: 'Tháng 11', value: '11' },
  { label: 'Tháng 12', value: '12' },
];

export const parseDate = (value?: Date | number | string) => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value, 0, 1);
  }

  const date = moment(
    value,
    ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM, YYYY', 'YYYY'],
    true,
  );

  if (date.isValid()) {
    return date.toDate();
  }

  const fallback = moment(value);
  return fallback.isValid() ? fallback.toDate() : undefined;
};

export const getYearList = (centerYear: number, range = 50) => {
  const years: string[] = [];
  for (let year = centerYear - range; year <= centerYear + range; year += 1) {
    years.push(year.toString());
  }
  return years;
};

export const getDayList = (month: string, year: string) => {
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const value = (index + 1).toString().padStart(2, '0');
    return { label: value, value };
  });
};

export const getDayValue = (value?: Date | string) => {
  const date = parseDate(value) ?? new Date();
  return {
    day: moment(date).format('DD'),
    month: moment(date).format('MM'),
    year: moment(date).format('YYYY'),
  };
};

export const clampDate = (date: Date, minDate?: Date, maxDate?: Date) => {
  if (minDate && moment(date).isBefore(minDate, 'day')) {
    return minDate;
  }

  if (maxDate && moment(date).isAfter(maxDate, 'day')) {
    return maxDate;
  }

  return date;
};

export const getMonthYearValue = (value?: Date | string) => {
  if (typeof value === 'string' && value.includes(',')) {
    const [month, year] = value.split(',').map(item => item.trim());
    return {
      month: month.padStart(2, '0'),
      year,
    };
  }

  const date = parseDate(value) ?? new Date();
  return {
    month: moment(date).format('MM'),
    year: moment(date).format('YYYY'),
  };
};

export const formatDateValue = (
  date: Date,
  type: DatePickerType,
  mode: 'date' | 'time' | 'datetime',
) => {
  if (type === 'year') {
    return moment(date).format('YYYY');
  }

  if (type === 'month_year') {
    return moment(date).format('MM, YYYY');
  }

  return moment(date).format(
    mode === 'datetime' ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD',
  );
};

export const formatDisplayValue = (
  value: Date | string | undefined,
  type: DatePickerType,
  mode: 'date' | 'time' | 'datetime',
) => {
  if (!value) {
    return '';
  }

  if (type === 'year') {
    return value.toString();
  }

  if (type === 'month_year') {
    const monthYear = getMonthYearValue(value);
    const monthLabel = MONTHS.find(
      item => item.value === monthYear.month,
    )?.label;
    return `${monthLabel ?? `Tháng ${Number(monthYear.month)}`}, ${
      monthYear.year
    }`;
  }

  const date = parseDate(value);
  if (!date) {
    return '';
  }

  return moment(date).format(
    mode === 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY',
  );
};
