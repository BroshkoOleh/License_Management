"use client";

import { Fragment, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { where } from "firebase/firestore";
import {
  getCollection,
  addEntry,
  countDocs,
  FIREBASE_COLLECTION_NAMES,
} from "../../../utils/firebase/firebaseFirestore";
import { addUser } from "../../../utils/firebase/firebaseFunction";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import FormikButton from "../../FormikButton/FormikButton";
import FormikTextfield from "../../FormikTextField/FormikTextField";
import React from "react";
import FormikSelect from "../../FormikSelect/FormikSelect";
import { USER_ROLE } from "../../../utils/helpers/constants";
import Typography from "@mui/material/Typography";
import { FirebaseError } from "firebase/app";
import { useStore } from "@/app/store/useStore";
import { User } from "../../../types/types";

const INITIAL_FORM_STATE = {
  displayName: "",
  role: USER_ROLE.ADMIN as "Admin" | "Editor" | "Viewer",
  email: "",
  password: "",
  confirmPassword: "",
};

const FORM_VALIDATION = Yup.object().shape({
  displayName: Yup.string().required("Required"),
  role: Yup.string().oneOf(Object.values(USER_ROLE)).required("Required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
    .test("checkEmailAvailability", "Email address already in use", async function (value) {
      const emailCount = await countDocs(
        FIREBASE_COLLECTION_NAMES.USERS,
        where("email", "==", value || "")
      );
      return emailCount === 0;
    }),

  password: Yup.string().min(6, "Needs to be 6 characters or longer").required("Required"),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Password doesn't match"),
});

interface UserAddDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface FormValues {
  displayName: string;
  role: "Admin" | "Editor" | "Viewer";
  email: string;
  password: string;
}

const UserAddDialog = ({ open, handleClose }: UserAddDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const setUsers = useStore((state) => state.setUsers);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { displayName, role, email, password } = values;

    try {
      // Close the dialog immediately
      handleClose();

      // Add user to Firebase Auth
      await addUser(email, password);

      // Add user data to Firestore
      await addEntry(FIREBASE_COLLECTION_NAMES.USERS, email, {
        displayName,
        email,
        role,
      });
      const newUsers = await getCollection<User>(FIREBASE_COLLECTION_NAMES.USERS);
      setUsers(newUsers);
      // Show success message
      enqueueSnackbar(`User "${email}" successfully created`, {
        variant: "success",
      });

      // Reset form
      resetForm();
    } catch (error) {
      // Handle errors
      if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
        enqueueSnackbar("This email address is already in use", {
          variant: "info",
        });
      } else {
        enqueueSnackbar(`Failed to add user "${email}". Please try again.`, { variant: "error" });
        console.error("User creation failed:", error);
      }
    }
  };

  useEffect(() => {
    if (!open && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [open]);

  return (
    <Fragment>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        innerRef={formikRef}
        validateOnChange
        validateOnBlur
      >
        {() => {
          return (
            <Form>
              <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                  <Stack spacing={2} marginY={2} alignItems="center">
                    <Typography
                      variant="h6"
                      sx={{ mx: 3 }}
                      style={{
                        fontWeight: "bold",
                        padding: "10px",
                        margin: "10px",
                        letterSpacing: ".2vh",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      General
                    </Typography>
                    <FormikTextfield
                      name="displayName"
                      fullWidth={true}
                      label="Full Name"
                      variant="standard"
                    />
                    <FormikSelect
                      name="role"
                      label="Role"
                      options={[
                        { value: USER_ROLE.ADMIN, label: USER_ROLE.ADMIN },
                        { value: USER_ROLE.EDITOR, label: USER_ROLE.EDITOR },
                        { value: USER_ROLE.VIEWER, label: USER_ROLE.VIEWER },
                      ]}
                    />
                    <FormikTextfield
                      name="email"
                      fullWidth={true}
                      label="Email Address"
                      variant="standard"
                    />
                    <FormikTextfield
                      name="password"
                      fullWidth={true}
                      label="Password"
                      variant="standard"
                      type="password"
                    />
                    <FormikTextfield
                      name="confirmPassword"
                      fullWidth={true}
                      label="Confirm Password"
                      variant="standard"
                      type="password"
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} sx={{ color: "red" }}>
                    Cancel
                  </Button>
                  <FormikButton type="submit" sx={{ color: "green" }}>
                    Save
                  </FormikButton>
                </DialogActions>
              </Dialog>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default UserAddDialog;
