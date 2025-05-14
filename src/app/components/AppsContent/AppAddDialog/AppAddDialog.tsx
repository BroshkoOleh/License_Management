import { useSnackbar } from "notistack";
import { Formik, Form, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";

import {
  getCollection,
  addEntry,
  FIREBASE_COLLECTION_NAMES,
} from "../../../utils/firebase/firebaseFirestore";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";

import FormikButton from "../../FormikButton/FormikButton";
import FormikTextfield from "../../FormikTextField/FormikTextField";
import { generateUID } from "../../../utils/helpers/generateUID";

import { AppType } from "../../../types/types";
import { useStore } from "@/app/store/useStore";

import { useEffect, useRef } from "react";
import { useApps } from "@/app/store/storeHooks/useApps";

const APP_UUID_LENGTH = 36;

interface AppAddDialogProps {
  open: boolean;
  handleClose: () => void;
}
interface FormValues {
  appName: string;
  uuid: string;
}

const AppAddDialog = ({ open, handleClose }: AppAddDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setApps = useStore((state) => state.setApps);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const allApps = useApps();

  useEffect(() => {
    if (!open && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [open]);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { appName, uuid } = values;
    const id = generateUID();

    // Close the dialog immediately
    handleClose();

    try {
      await addEntry(FIREBASE_COLLECTION_NAMES.APPS, id, { id, uuid, appName });

      const newApps = await getCollection<AppType>(FIREBASE_COLLECTION_NAMES.APPS);
      setApps(newApps);

      enqueueSnackbar(`App "${appName}" was successfully added.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to add the app "${appName}". Please try again.`, {
        variant: "error",
      });
      console.error("adding app failed:", error);
    }
  };

  const isIdUnique: Yup.TestFunction<string | undefined, Yup.AnyObject> = function (value) {
    if (!value) return true;
    return !allApps.some((app) => app.uuid === value);
  };

  const isAppNameUnique: Yup.TestFunction<string | undefined, Yup.AnyObject> = function (value) {
    if (!value) return true;
    return !allApps.some((app) => app.appName.localeCompare(value) === 0);
  };

  const FORM_VALIDATION = Yup.object().shape({
    uuid: Yup.string()
      .length(APP_UUID_LENGTH, `Must be exactly ${APP_UUID_LENGTH} characters long`)
      .test("is-uuid-unique", "App UUID is already used", isIdUnique)
      .required("Required"),
    appName: Yup.string()
      .test("is-app-name-unique", "Already used", isAppNameUnique)
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ uuid: "", appName: "" }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
      innerRef={formikRef}
      enableReinitialize={true}
    >
      <Form>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Add New App</DialogTitle>
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

export default AppAddDialog;
