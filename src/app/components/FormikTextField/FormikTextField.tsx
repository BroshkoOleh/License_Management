import { useField } from "formik";
import TextField, { TextFieldProps } from "@mui/material/TextField";

const FormikTextField = ({ name, label, ...otherProps }: TextFieldProps) => {
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
