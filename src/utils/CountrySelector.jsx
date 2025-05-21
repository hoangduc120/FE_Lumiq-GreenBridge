import Select from 'react-select';
import countryList from 'react-select-country-list';

const CountrySelector = ({ value, onChange, isEditing }) => {
  const countries = countryList().getData(); // Lấy danh sách quốc gia

  const options = countries.map((country) => ({
    value: country.label,
    label: (
      <div className="flex items-center gap-2">
        <img
          src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
          alt={country.label}
          className="w-4 h-4"
        />
        <span>{country.label}</span>
      </div>
    ),
  }));

  return (
    <Select
      options={options}
      isSearchable
      placeholder={isEditing ? 'Select a country' : 'Editing disabled'}
      value={options.find((option) => option.value === value)}
      onChange={(selectedOption) =>
        onChange({ target: { name: 'country', value: selectedOption.value } })
      }
      isDisabled={!isEditing} // Disable select khi không ở trạng thái edit
      classNamePrefix="react-select"
    />
  );
};

export default CountrySelector;
