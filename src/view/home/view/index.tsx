import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Form, FormItemsProps, ItemSelectProduct } from '../../../component';
import { Text } from 'react-native-gesture-handler';
import { FormRef } from '../../../component/form/form/entity';

const provinces: ItemSelectProduct[] = [
  {
    id: 1,
    name: 'TP. Hồ Chí Minh',
    value: 'hcm',
    isSelected: false,
  },
  {
    id: 2,
    name: 'Hà Nội',
    value: 'hn',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Đà Nẵng',
    value: 'dn',
    isSelected: false,
  },
  {
    id: 4,
    name: 'Hải Phòng',
    value: 'hp',
    isSelected: false,
  },
  {
    id: 5,
    name: 'Cần Thơ',
    value: 'ct',
    isSelected: false,
  },
  {
    id: 6,
    name: 'Bình Dương',
    value: 'bd',
    isSelected: false,
  },
  {
    id: 7,
    name: 'Đồng Nai',
    value: 'dna',
    isSelected: false,
  },
  {
    id: 8,
    name: 'Bà Rịa - Vũng Tàu',
    value: 'brvt',
    isSelected: false,
  },
  {
    id: 9,
    name: 'Khánh Hòa',
    value: 'kh',
    isSelected: false,
  },
  {
    id: 10,
    name: 'Lâm Đồng',
    value: 'ld',
    isSelected: false,
  },
  {
    id: 11,
    name: 'Nghệ An',
    value: 'na',
    isSelected: false,
  },
  {
    id: 12,
    name: 'Thanh Hóa',
    value: 'th',
    isSelected: false,
  },
  {
    id: 13,
    name: 'Thừa Thiên Huế',
    value: 'hue',
    isSelected: false,
  },
  {
    id: 14,
    name: 'Quảng Ninh',
    value: 'qn',
    isSelected: false,
  },
  {
    id: 15,
    name: 'Bắc Ninh',
    value: 'bn',
    isSelected: false,
  },
  {
    id: 16,
    name: 'Bắc Giang',
    value: 'bg',
    isSelected: false,
  },
  {
    id: 17,
    name: 'Thái Nguyên',
    value: 'tn',
    isSelected: false,
  },
  {
    id: 18,
    name: 'Phú Thọ',
    value: 'pt',
    isSelected: false,
  },
  {
    id: 19,
    name: 'Nam Định',
    value: 'nd',
    isSelected: false,
  },
  {
    id: 20,
    name: 'Hải Dương',
    value: 'hd',
    isSelected: false,
  },
  {
    id: 21,
    name: 'Hưng Yên',
    value: 'hy',
    isSelected: false,
  },
  {
    id: 22,
    name: 'Quảng Nam',
    value: 'qna',
    isSelected: false,
  },
  {
    id: 23,
    name: 'Quảng Ngãi',
    value: 'qng',
    isSelected: false,
  },
  {
    id: 24,
    name: 'Bình Định',
    value: 'bdi',
    isSelected: false,
  },
  {
    id: 25,
    name: 'Phú Yên',
    value: 'py',
    isSelected: false,
  },
  {
    id: 26,
    name: 'Bình Thuận',
    value: 'bth',
    isSelected: false,
  },
  {
    id: 27,
    name: 'Ninh Thuận',
    value: 'nt',
    isSelected: false,
  },
  {
    id: 28,
    name: 'Đắk Lắk',
    value: 'dl',
    isSelected: false,
  },
  {
    id: 29,
    name: 'Gia Lai',
    value: 'gl',
    isSelected: false,
  },
  {
    id: 30,
    name: 'Kiên Giang',
    value: 'kg',
    isSelected: false,
  },
];

const wardsByProvince: Record<string, ItemSelectProduct[]> = {
  hcm: [
    { id: 11, name: 'Phường Bến Nghé', value: 'ben-nghe', isSelected: false },
    { id: 12, name: 'Phường Sài Gòn', value: 'sai-gon', isSelected: false },
    { id: 13, name: 'Phường Tân Định', value: 'tan-dinh', isSelected: false },
    { id: 14, name: 'Phường An Khánh', value: 'an-khanh', isSelected: false },
  ],
  hn: [
    { id: 21, name: 'Phường Hoàn Kiếm', value: 'hoan-kiem', isSelected: false },
    { id: 22, name: 'Phường Ba Đình', value: 'ba-dinh', isSelected: false },
    { id: 23, name: 'Phường Cầu Giấy', value: 'cau-giay', isSelected: false },
    { id: 24, name: 'Phường Tây Hồ', value: 'tay-ho', isSelected: false },
  ],
  dn: [
    { id: 31, name: 'Phường Hải Châu', value: 'hai-chau', isSelected: false },
    { id: 32, name: 'Phường Sơn Trà', value: 'son-tra', isSelected: false },
    { id: 33, name: 'Phường Thanh Khê', value: 'thanh-khe', isSelected: false },
    {
      id: 34,
      name: 'Phường Ngũ Hành Sơn',
      value: 'ngu-hanh-son',
      isSelected: false,
    },
  ],
  hp: [
    { id: 41, name: 'Phường Hồng Bàng', value: 'hong-bang', isSelected: false },
    { id: 42, name: 'Phường Ngô Quyền', value: 'ngo-quyen', isSelected: false },
    { id: 43, name: 'Phường Lê Chân', value: 'le-chan', isSelected: false },
  ],
  ct: [
    { id: 51, name: 'Phường Ninh Kiều', value: 'ninh-kieu', isSelected: false },
    { id: 52, name: 'Phường Cái Răng', value: 'cai-rang', isSelected: false },
    { id: 53, name: 'Phường Bình Thủy', value: 'binh-thuy', isSelected: false },
  ],
};

const demoMultiSelect: ItemSelectProduct[] = [
  { id: 101, name: 'CMND/CCCD', value: 'id-card', isSelected: false },
  {
    id: 102,
    name: 'Hộ khẩu/Thông tin cư trú',
    value: 'residence',
    isSelected: false,
  },
  {
    id: 103,
    name: 'Sao kê lương',
    value: 'salary-statement',
    isSelected: false,
  },
  {
    id: 104,
    name: 'Hợp đồng lao động',
    value: 'labor-contract',
    isSelected: false,
  },
  {
    id: 105,
    name: 'Giấy đăng ký kết hôn',
    value: 'marriage-certificate',
    isSelected: false,
  },
  {
    id: 106,
    name: 'Hóa đơn điện nước',
    value: 'utility-bill',
    isSelected: false,
  },
  {
    id: 107,
    name: 'Ảnh tài sản đảm bảo',
    value: 'collateral-photo',
    isSelected: false,
  },
  { id: 108, name: 'Giấy tờ xe', value: 'vehicle-document', isSelected: false },
  {
    id: 109,
    name: 'Bảo hiểm khoản vay',
    value: 'loan-insurance',
    isSelected: false,
  },
  {
    id: 110,
    name: 'Mục không cho chọn',
    value: 'disabled-option',
    isSelected: false,
    canPress: false,
  },
];

export const formSelectNew = (): Array<FormItemsProps> => [
  {
    key: 'current_Address',
    type: 'INPUT',
    label: 'Địa chỉ Thường trú',
    value: '',
    error: '',
    isRequire: true,
    dataRadio: [],
    dataSelect: [],
    disabled: false,
    searchBox: true,
    textSearch: '',
    filterOption: true,
  },
  {
    key: 'province_new',
    type: 'SELECT',
    label: 'Tỉnh/Thành phố',
    multiline: true,
    value: '',
    error: '',
    isRequire: true,
    dataRadio: [],
    dataSelect: provinces,
    disabled: false,
    searchBox: true,
    textSearch: '',
    filterOption: true,
  },
  {
    key: 'district_new',
    type: 'SELECT',
    label: 'Phường/Xã',
    multiline: true,
    value: '',
    error: '',
    isRequire: true,
    dataRadio: [],
    dataSelect: [],
    disabled: false,
    searchBox: true,
    textSearch: '',
    filterOption: true,
  },
  {
    key: 'DEMO_NEW',
    type: 'MULTI_SELECT',
    label: 'DEMO CHỌN NHIỀU',
    multiline: true,
    value: [],
    error: '',
    isRequire: true,
    dataRadio: [],
    dataSelect: demoMultiSelect,
    disabled: false,
    searchBox: true,
    textSearch: '',
    filterOption: true,
    maxSelected: 3,
  },
];

export function HomeScreen(): React.ReactElement {
  const refError = useRef<FormRef>(null);
  const [formSelect, setFormSelect] = useState<Array<FormItemsProps>>(
    formSelectNew(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Form
        data={formSelect}
        ref={refError}
        onChangeText={(value, index) => {
          const tmp = [...formSelect];
          tmp[index] = {
            ...tmp[index],
            value,
            error: '',
          };
          setFormSelect(tmp);
        }}
        onSelected={(value: ItemSelectProduct | undefined, index) => {
          const tmp = [...formSelect];

          if (value) {
            tmp[index] = { ...tmp[index], value };

            if (index === 1) {
              tmp[1].error = '';
              tmp[2] = {
                ...tmp[2],
                value: '',
                dataSelect: wardsByProvince[value.value] ?? [],
              };
            }
          } else {
            tmp[index] = { ...tmp[index], value: '' };
            if (index === 1) {
              tmp[2] = {
                ...tmp[2],
                value: '',
                dataSelect: [],
              };
            }
          }

          setFormSelect(tmp);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          // const tmp = [...formSelect];
          // tmp[0].error = '1231231231';
          // tmp[1].error = '1231231231';
          // setFormSelect(tmp);
          console.log(formSelect);
        }}
      >
        <Text>ávasvasv</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});
