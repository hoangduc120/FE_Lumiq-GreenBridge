import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAddressData } from '../api/productApi';

const AddressSelector = ({ setAddressData, disabled, onChange, value }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceID, setSelectedProvinceID] = useState(
    value?.provinceId || ''
  );
  const [selectedDistrictID, setSelectedDistrictID] = useState(
    value?.districtId || ''
  );
  const [selectedWardID, setSelectedWardID] = useState(value?.wardId || '');
  const [manualAddress, setManualAddress] = useState(
    value?.manualAddress || ''
  );

  useEffect(() => {
    if (value) {
      setSelectedProvinceID(value.provinceId || '');
      setSelectedDistrictID(value.districtId || '');
      setSelectedWardID(value.wardId || '');
      setManualAddress(value.manualAddress || '');
    }
  }, [value]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: { token: '33d08723-a497-11ef-bfcf-9e83397c467a' },
        }
      );
      setProvinces(response.data.data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceID) {
      const fetchDistricts = async () => {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvinceID}`,
          { headers: { token: '33d08723-a497-11ef-bfcf-9e83397c467a' } }
        );
        setDistricts(response.data.data);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvinceID]);

  useEffect(() => {
    if (selectedDistrictID) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrictID}`,
          { headers: { token: '33d08723-a497-11ef-bfcf-9e83397c467a' } }
        );
        setWards(response.data.data);
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrictID]);

  useEffect(() => {
    if (onChange) {
      const provinceName = provinces.find(
        (prov) => prov.ProvinceID == selectedProvinceID
      )?.ProvinceName;
      const districtName = districts.find(
        (dist) => dist.DistrictID == selectedDistrictID
      )?.DistrictName;
      const wardName = wards.find(
        (ward) => ward.WardCode == selectedWardID
      )?.WardName;

      onChange({
        provinceId: selectedProvinceID,
        districtId: selectedDistrictID,
        wardId: selectedWardID,
        provinceName: provinceName || '',
        districtName: districtName || '',
        wardName: wardName || '',
        manualAddress: manualAddress || '',
      });
    }
  }, [selectedProvinceID, selectedDistrictID, selectedWardID, manualAddress]);

  const handleFind = async () => {
    try {
      const provinceName = provinces.find(
        (prov) => prov.ProvinceID == selectedProvinceID
      )?.ProvinceName;
      const districtName = districts.find(
        (dist) => dist.DistrictID == selectedDistrictID
      )?.DistrictName;
      const wardName = wards.find(
        (ward) => ward.WardCode == selectedWardID
      )?.WardName;

      const response = await getAddressData(
        provinceName,
        districtName,
        wardName
      );
      setAddressData(response.data);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  useEffect(() => {
    setAddressData(null);
  }, [selectedProvinceID, selectedDistrictID, selectedWardID]);

  return (
    <div className="flex items-center">
      <select
        onChange={(e) => setSelectedProvinceID(e.target.value)}
        value={selectedProvinceID}
        disabled={disabled}
        className="w-auto border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-4"
      >
        <option value="">Select Province</option>
        {provinces.map((province) => (
          <option key={province.ProvinceID} value={province.ProvinceID}>
            {province.ProvinceName}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedDistrictID(e.target.value)}
        value={selectedDistrictID}
        disabled={disabled || !selectedProvinceID}
        className="w-auto border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-4"
      >
        <option value="">Select District</option>
        {districts.map((district) => (
          <option key={district.DistrictID} value={district.DistrictID}>
            {district.DistrictName}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedWardID(e.target.value)}
        value={selectedWardID}
        disabled={disabled || !selectedDistrictID}
        className="w-auto border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-4"
      >
        <option value="">Select Ward</option>
        {wards.map((ward) => (
          <option key={ward.WardCode} value={ward.WardCode}>
            {ward.WardName}
          </option>
        ))}
      </select>

      {!disabled && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleFind}
        >
          Find
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
