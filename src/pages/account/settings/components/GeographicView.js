import React, { useEffect } from 'react';
import { Select, Spin } from 'antd';
import { connect } from 'umi';
import styles from './GeographicView.less';

const { Option } = Select;

const nullSelectItem = {
  label: '',
  value: '',
  key: '',
};

const GeographicView = ({ loading, value, province, city, onChange, dispatch }) => {
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchProvince',
      });
    }
  });

  useEffect(() => {
    if (!value && !!value && !!value.province) {
      if (dispatch) {
        dispatch({
          type: 'user/fetchCity',
          payload: value.province.key,
        });
      }
    }
  });

  const getOption = (list) => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map((item) => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };

  const getProvinceOption = () => {
    if (province) {
      return getOption(province);
    }
    return [];
  };

  const getCityOption = () => {
    if (city) {
      return getOption(city);
    }
    return [];
  };

  const selectProvinceItem = (item) => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCity',
        payload: item.key,
      });
    }
    if (onChange) {
      onChange({
        province: item,
        city: nullSelectItem,
      });
    }
  };

  const selectCityItem = (item) => {
    if (value && onChange) {
      onChange({
        province: value.province,
        city: item,
      });
    }
  };

  const conversionObject = () => {
    if (!value) {
      return {
        province: nullSelectItem,
        city: nullSelectItem,
      };
    }
    const { province: p, city: c } = value;
    return {
      province: p || nullSelectItem,
      city: c || nullSelectItem,
    };
  };

  const { province: p, city: c } = conversionObject();

  return (
    <Spin spinning={loading} wrapperClassName={styles.row}>
      <Select className={styles.item} value={p} labelInValue showSearch onSelect={selectProvinceItem}>
        {getProvinceOption()}
      </Select>
      <Select className={styles.item} value={c} labelInValue showSearch onSelect={selectCityItem}>
        {getCityOption()}
      </Select>
    </Spin>
  );
};

export default connect(({ user, loading }) => {
  const { province, city } = user;
  return {
    province,
    city,
    loading: loading.models.user,
  };
})(GeographicView);
