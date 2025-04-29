import React, { useMemo } from "react";
import { useField, useFormikContext } from "formik";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  SelectChangeEvent,
} from "@mui/material";

// Визначаємо тип для опцій
type StringOption = string;
type ObjectOption = { value: string | number; label: string };
type OptionType = StringOption | ObjectOption;

interface FormikSelectProps extends Omit<SelectProps<string>, "onChange"> {
  name: string;
  label: string;
  options?: OptionType[];
  disabled?: boolean;
  isAdmin?: boolean;
  userTypeValue?: number;
}

const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  label,
  options = [],
  disabled = false,
  isAdmin = false,
  userTypeValue,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setFieldValue(name, event.target.value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    onChange: handleChange,
    variant: "outlined" as const,
  };

  const sortedOptions = useMemo(() => {
    if (!options || options.length === 0) return [];

    const optionsToSort = [...options];

    return optionsToSort.sort((a, b) => {
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
      } else if (typeof a === "object" && typeof b === "object") {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });
  }, [options]);

  const configFormControl = {
    fullWidth: true,
    error: meta.touched && !!meta.error,
  };

  return (
    <FormControl {...configFormControl} variant="outlined">
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select<string>
        {...configSelect}
        disabled={disabled}
        label={label}
        labelId={`${name}-label`}
        id={`${name}-select`}
      >
        {sortedOptions.map((option) =>
          typeof option === "string" ? (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ) : (
            <MenuItem
              key={option.value.toString()}
              value={option.value.toString()}
              disabled={
                !isAdmin &&
                typeof option.value === "number" &&
                typeof userTypeValue === "number" &&
                option.value <= userTypeValue
              }
            >
              {option.label}
            </MenuItem>
          )
        )}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikSelect;
