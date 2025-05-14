import { useMemo } from "react";
import { useField, useFormikContext } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";

// type OptionType = {
//   options: string[];
// };

interface FormikAutocompleteProps {
  name: string;
  label: string;
  options: string[];
  handleGroups?: () => void;
  multiple?: boolean;
  getLabel?: (option: string) => string;
  getValue?: (option: string) => string;
}

const FormikAutocomplete = ({
  name,
  label,
  options,
  handleGroups = () => {},
  multiple = false,
  getLabel = (option) => (option === undefined || option === null ? "N/A" : option),
  getValue = (option) => option,
  ...otherProps
}: FormikAutocompleteProps) => {
  const [field, meta, helpers] = useField(name);
  const { values, setValues } = useFormikContext();

  const handleChange = (event: React.SyntheticEvent, newValue: string | string[] | null) => {
    const formattedValue = multiple
      ? (newValue as string[]).map((option) => getValue(option))
      : newValue
      ? getValue(newValue as string)
      : null;

    setValues({ ...values, [name]: formattedValue });
    handleGroups(newValue);
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const sortedOptions = useMemo(
    () =>
      [...options]
        .map((option) => (option === undefined || option === null ? "N/A" : option))
        .sort((a, b) => getLabel(a).localeCompare(getLabel(b))),
    [options, getLabel]
  );

  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;
    return getValue(option) === getValue(value);
  };

  const value = useMemo(
    () =>
      multiple
        ? (values[name] || []).map((val) => options.find((opt) => getValue(opt) === val))
        : options.find((opt) => getValue(opt) === values[name]) || null,
    [values, name, options, getValue, multiple]
  );

  const getOptionLabel = (option) => {
    if (option === undefined || option === null) return "N/A";
    return typeof option === "object" ? getLabel(option) : option;
  };

  return (
    <FormControl fullWidth error={meta.touched && !!meta.error}>
      <Autocomplete
        {...otherProps}
        name={field.name}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        value={value}
        options={sortedOptions}
        isOptionEqualToValue={isOptionEqualToValue}
        multiple={multiple}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? meta.error : ""}
          />
        )}
      />
    </FormControl>
  );
};

export default FormikAutocomplete;
