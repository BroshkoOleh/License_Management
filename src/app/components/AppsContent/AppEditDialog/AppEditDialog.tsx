import { useSnackbar } from "notistack";
import { Formik, Form, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";

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

import { AppType } from "../../../types/types";

import { useStore } from "@/app/store/useStore";
import { useApps } from "@/app/store/storeHooks/useApps";
import { useEffect, useRef } from "react";

interface AppsEditDialogProps {
  open: boolean;
  handleClose: () => void;
  app: AppType;
}
interface FormValues {
  appName: string;
  uuid: string;
}

const AppEditDialog = ({ open, handleClose, app }: AppsEditDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const setApps = useStore((state) => state.setApps);

  const allApps = useApps();

  useEffect(() => {
    if (!open && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [open]);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { appName, uuid } = values;

    if (appName === app.appName && uuid === app.uuid) {
      resetForm();
      handleClose();

      return;
    }

    // Close the dialog immediately
    handleClose();

    try {
      await updateEntry(FIREBASE_COLLECTION_NAMES.APPS, app.id, {
        id: app.id,
        uuid: uuid,
        appName,
      });
      const newApps = await getCollection<AppType>(FIREBASE_COLLECTION_NAMES.APPS);
      setApps(newApps);
      enqueueSnackbar(`App "${appName}" was successfully edited.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to edit the app "${appName}". Please try again.`, {
        variant: "error",
      });
      console.error("editing app failed:", error);
    }
  };

  const FORM_VALIDATION = Yup.object().shape({
    appName: Yup.string()
      .test("is-app-name-unique", "Already used", (value) => {
        return (
          allApps.filter(
            (existingApp) => existingApp.appName === value && existingApp.uuid !== app.uuid
          ).length === 0
        );
      })
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ uuid: app.uuid, appName: app.appName }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
      innerRef={formikRef}
      enableReinitialize={true}
    >
      <Form>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Edit App</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} marginY={2} alignItems="start">
              <FormikTextfield name="appName" fullWidth label="App Name" variant="standard" />
              <FormikTextfield name="uuid" fullWidth label="App UUID" variant="standard" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "red" }} onClick={handleClose}>
              Cancel
            </Button>
            <FormikButton type="submit" sx={{ color: "green" }}>
              Save
            </FormikButton>
          </DialogActions>
        </Dialog>
      </Form>
    </Formik>
  );
};

export default AppEditDialog;
