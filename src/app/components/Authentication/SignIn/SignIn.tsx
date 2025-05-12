import { use, useRef, useState } from "react";
import { signInUserWithEmailAndPassword } from "../../../utils/firebase/firebaseAuth";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import FormikTextfield from "../../FormikTextField/FormikTextField";
import { warningAuthNotCorrect } from "../../../utils/helpers/warnings";
import * as Yup from "yup";
import FormikSelect from "../../FormikSelect/FormikSelect";
import { FIREBASE_COLLECTION_NAMES, getEntry } from "../../../utils/firebase/firebaseFirestore";
import { User } from "../../../types/types";
import { useStore } from "@/app/store/useStore";
import { useRouter } from "next/navigation";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
  region: "Europe",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

interface SignInFormProps {
  setRefresherOpen: (value: boolean) => void;
  setEmail: (value: string) => void;
}
export const SignInForm = ({ setRefresherOpen, setEmail }: SignInFormProps) => {
  const setEnhancedUser = useStore((state) => state.setEnhancedUser);
  const router = useRouter();
  const [authError, setAuthError] = useState(false);
  const [onChange, setOnChange] = useState(false);
  const formikLoginRef = useRef(null);

  const handleSubmit = async (
    values: { email: string; password: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    const { email, password } = values;
    try {
      const result = await signInUserWithEmailAndPassword(email, password);

      console.log("result", result);
      if (result && result.user.email) {
        const userData = await getEntry<User>(FIREBASE_COLLECTION_NAMES.USERS, result?.user?.email);
        setEnhancedUser(userData ? userData : null);
      }
      router.push("/licenses");
      resetForm();
    } catch (error) {
      setAuthError(true);
      setOnChange(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        // width: 500,
        padding: 4,
        margin: 4,
      }}
    >
      <Typography variant="h6" component="div" textAlign="center">
        Sign in with your email address and password
      </Typography>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
        innerRef={formikLoginRef}
      >
        {({ values }) => (
          <Form
            onChange={() => {
              setOnChange(true);
              setEmail(values.email);
            }}
          >
            <Box mt={4}>
              <FormikTextfield name="email" label="Email-Adresse" type="" />
            </Box>
            <Box mt={2}>
              <FormikTextfield name="password" type="password" label="Passwort" />
            </Box>
            <Box mt={2}>
              <FormikSelect
                name="region"
                label="Region"
                disabled={true}
                options={[{ value: "Europe", label: "Europe" }]}
              />
            </Box>
            {authError && !onChange && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "red",
                    fontWeight: 500,
                    letterSpacing: "0.02857em",
                    ml: "14px",
                  }}
                >
                  {warningAuthNotCorrect}
                </Typography>
              </Box>
            )}
            <Box mt={1}>
              <Button type="submit" size="large">
                Sign In
              </Button>
              <Button onClick={() => setRefresherOpen(true)} style={{ color: "red" }} size="large">
                Forgot password?
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
