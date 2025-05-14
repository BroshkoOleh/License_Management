import { useSnackbar } from "notistack";
import { Formik, Form, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { addEntry, getCollection } from "../../../utils/firebase/firebaseFirestore";
import { FIREBASE_COLLECTION_NAMES } from "../../../utils/firebase/firebaseFirestore";
import { generateUID } from "../../../utils/helpers/generateUID";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import FormikButton from "../../FormikButton/FormikButton";
import FormikTextfield from "../../FormikTextField/FormikTextField";
import FormikAutocomplete from "../../FormikAutocomplete/FormikAutocomplete";
import React, { useEffect, useRef } from "react";
import { useGroups } from "@/app/store/storeHooks/useGroups";
import { useUsers } from "@/app/store/storeHooks/useUsers";
import { useStore } from "@/app/store/useStore";
import { Group } from "../../../types/types";

interface GroupAddDialogProps {
  open: boolean;
  handleClose: () => void;
}

const GroupAddDialog = ({ open, handleClose }: GroupAddDialogProps) => {
  const setGroups = useStore((state) => state.setGroups);
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = useRef<FormikProps<FormValues>>(null);

  //Groups
  const allGroups = useGroups();

  // All Users
  const allUsers = useUsers();
  const allUserEmails = allUsers.reduce<string[]>((acc, user) => {
    acc.push(user.email);
    return acc;
  }, []);

  interface FormValues {
    groupName: string;
    userEmails: string[];
  }

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { groupName, userEmails } = values;

    // Close the dialog immediately
    handleClose();

    try {
      const id = generateUID();

      addEntry(FIREBASE_COLLECTION_NAMES.GROUPS, id, {
        id,
        groupName,
        userEmails,
      });
      const newGroups = await getCollection<Group>(FIREBASE_COLLECTION_NAMES.GROUPS);
      setGroups(newGroups);
      enqueueSnackbar(`Group "${groupName}" was successfully added.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to add the group "${groupName}". Please try again.`, {
        variant: "error",
      });
      console.log("adding group failed: ", error);
    }
  };

  useEffect(() => {
    if (!open && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [open]);

  const FORM_VALIDATION = Yup.object().shape({
    groupName: Yup.string()
      .test("is-group-name-unique", "Already used", (value) => {
        return !allGroups.some((group) => group.groupName === value);
      })
      .required("Required"),
    userEmails: Yup.array().min(1, "Required").of(Yup.string().email("Invalid email")),
  });

  return (
    <Formik
      initialValues={{ groupName: "", userEmails: [] }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
      innerRef={formikRef}
      enableReinitialize={true}
    >
      {({ errors, touched }) => (
        <Form>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Add New Group</DialogTitle>
            <DialogContent>
              <Stack direction="column" spacing={1} marginY={2} alignItems="start">
                <FormikTextfield name="groupName" fullWidth label="Group Name" variant="standard" />
                <FormikAutocomplete
                  name="userEmails"
                  label="Assigned Users"
                  options={allUserEmails}
                  multiple={true}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: "red" }}>
                Cancel
              </Button>
              <FormikButton sx={{ color: "green" }}>Save</FormikButton>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default GroupAddDialog;
