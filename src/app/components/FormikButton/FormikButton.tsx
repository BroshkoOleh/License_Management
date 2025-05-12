import { useFormikContext } from "formik";
import { ReactNode } from "react";

import Button, { ButtonProps } from "@mui/material/Button";

interface FormikButtonProps {
  children: ReactNode;
}
const FormikButton = ({ children, ...otherProps }: FormikButtonProps & ButtonProps) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton = {
    ...otherProps,
    onClick: handleSubmit,
  };

  return <Button {...configButton}>{children}</Button>;
};

export default FormikButton;
