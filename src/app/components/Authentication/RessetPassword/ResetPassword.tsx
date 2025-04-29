// import { useSnackbar } from "notistack";
// import { sendResetPasswordEmail } from "../../utils/firebase/firebase-auth.utils";
import { sendResetPasswordEmail } from "../../../utils/firebase/firebaseAuth";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikTextField from "../../FormikTextField/FormikTextField";

interface ResetPasswordFormProps {
  setRefresherOpen: (value: boolean) => void;
  email: string;
}

export const ResetPasswordForm = ({ setRefresherOpen, email }: ResetPasswordFormProps) => {
  //   const { enqueueSnackbar } = useSnackbar();

  const handleReset = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    const { email } = values;

    try {
      await sendResetPasswordEmail(email);
      console.log(`Password reset email successfully sent to "${email}".`);
      //   enqueueSnackbar(`Password reset email successfully sent to "${email}".`, {
      //     variant: "success",
      //   });
    } catch (error) {
      //   enqueueSnackbar(`Failed to reset the password of the user "${email}". Please try again`, {
      //     variant: "error",
      //   });
      console.log(`Failed to reset the password of the user "${email}". Please try again`);
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 500, padding: 4, margin: 4 }}>
      <Typography variant="h6" component="div" textAlign="center">
        Request to reset your password
      </Typography>
      <Formik
        initialValues={{ email: email || "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email("Invalid email address").required("Required"),
        })}
        onSubmit={handleReset}
      >
        <Form>
          <Box mt={4}>
            <FormikTextField name="email" label="Email-Adresse" type="" />
          </Box>
          <Box mt={1}>
            <Button type="submit" size="large">
              Reset Password
            </Button>
            <Button onClick={() => setRefresherOpen(false)} style={{ color: "red" }}>
              Back
            </Button>
          </Box>
        </Form>
      </Formik>
    </Paper>
  );
};
