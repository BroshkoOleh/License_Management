"use client";

import { useSnackbar } from "notistack";
// import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { USER_ROLE } from "../../../utils/helpers/constants";
import {
  updateEntry,
  FIREBASE_COLLECTION_NAMES,
  getCollection,
} from "../../../utils/firebase/firebaseFirestore";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import FormikButton from "../../FormikButton/FormikButton";
import FormikTextfield from "../../FormikTextField/FormikTextField";
import FormikSelect from "../../FormikSelect/FormikSelect";
import { User } from "../../../types/types";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef } from "react";
import { useStore } from "../../../store/useStore";

interface UserEditDialogProps {
  open: boolean;
  handleClose: () => void;
  user: User;
}
interface FormValues {
  fullName: string;
  role: "Admin" | "Editor" | "Viewer";
}

const UserEditDialog = ({ open, handleClose, user }: UserEditDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const currentUser = useStore((state) => state.enhancedUser);
  const setUsers = useStore((state) => state.setUsers);

  const formikRef = useRef<FormikProps<FormValues>>(null);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { fullName, role } = values;
    if (fullName === user.displayName && user.role === role) {
      handleClose();
      resetForm();
      return;
    }

    // Close the dialog immediately
    handleClose();

    try {
      await updateEntry(FIREBASE_COLLECTION_NAMES.USERS, user.email, {
        displayName: fullName,
        role,
      });
      resetForm();
      enqueueSnackbar(`User "${user.email}" was successfully edited.`, {
        variant: "success",
      });
      const newUsers = await getCollection<User>(FIREBASE_COLLECTION_NAMES.USERS);
      setUsers(newUsers);
    } catch (error) {
      enqueueSnackbar(`Failed to edit the user "${fullName}". Please try again.`, {
        variant: "error",
      });
      console.log("Editing user failed: ", error);
    }
  };

  // Reset form on dialog close
  useEffect(() => {
    if (!open && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [open]);

  const FORM_VALIDATION = Yup.object().shape({
    fullName: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{
        fullName: user.displayName || "",
        role: user.role,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
      innerRef={formikRef}
      enableReinitialize={true}
    >
      {({ resetForm, isValid }) => {
        useEffect(() => {
          if (!open) return;

          if (!formikRef.current) return;
        }, [open]);

        return (
          <Form>
            <Dialog
              open={open}
              onClose={() => {
                handleClose();
                resetForm();
              }}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>Edit User</DialogTitle>
              <DialogContent>
                <Stack spacing={2} alignItems="center">
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
                  <FormikTextfield name="fullName" fullWidth label="Full Name" variant="standard" />
                  <FormikSelect
                    name="role"
                    label="Role"
                    options={[
                      { value: USER_ROLE.ADMIN, label: USER_ROLE.ADMIN },
                      { value: USER_ROLE.EDITOR, label: USER_ROLE.EDITOR },
                      { value: USER_ROLE.VIEWER, label: USER_ROLE.VIEWER },
                    ]}
                    disabled={currentUser?.email === user.email}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                    resetForm();
                  }}
                  sx={{ color: "red" }}
                >
                  Cancel
                </Button>
                <FormikButton type="submit" sx={{ color: "green" }} disabled={!isValid}>
                  Save
                </FormikButton>
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UserEditDialog;
