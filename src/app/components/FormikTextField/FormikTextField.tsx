import { useField } from "formik";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface FormikTextFieldProps {
  name: string;
  label: string;
  type: string;
}

const FormikTextField = ({ name, label, ...otherProps }: FormikTextFieldProps) => {
  const [field, meta] = useField(name);

  const configTextfield: TextFieldProps = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    rows: 5,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return <TextField {...configTextfield} label={label} />;
};

export default FormikTextField;
