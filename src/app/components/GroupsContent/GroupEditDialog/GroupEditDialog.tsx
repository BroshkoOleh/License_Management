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
import FormikAutocomplete from "../../FormikAutocomplete/FormikAutocomplete";
import React, { useEffect } from "react";
import { useRef } from "react";
import { getAuth } from "firebase/auth";
import { Group } from "../../../types/types";
import { useGroups } from "@/app/store/storeHooks/useGroups";
import { useUsers } from "@/app/store/storeHooks/useUsers";
import { useStore } from "../../../store/useStore";

interface GroupEditDialogProps {
  open: boolean;
  handleClose: () => void;
  group: Group;
}

const GroupEditDialog = ({ open, handleClose, group }: GroupEditDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setGroups = useStore((state) => state.setGroups);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  //Groups
  const allGroups = useGroups();

  // Users
  const allUsers = useUsers();
  const allUserEmails = allUsers.reduce<string[]>((acc, user) => {
    acc.push(user.email);
    return acc;
  }, []);
  const initialUserEmails = allUserEmails
    .reduce<string[]>((acc, userEmail) => {
      if (group.userEmails.includes(userEmail)) {
        acc.push(userEmail);
      }
      return acc;
    }, [])
    .sort((a, b) => a.localeCompare(b));

  //   const currentGroupName = group.groupName;
  //     const currentGroupUsers = group.userEmails;

  interface FormValues {
    groupName: string;
    userEmails: string[];
  }

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { groupName, userEmails } = values;

    if (
      group.groupName === groupName &&
      group.userEmails.length === userEmails.length &&
      group.userEmails.every((email) => userEmails.includes(email))
    ) {
      handleClose();
      resetForm();

      return;
    }

    // Close the dialog immediately
    handleClose();

    try {
      updateEntry(FIREBASE_COLLECTION_NAMES.GROUPS, group.id, {
        groupName,
        userEmails,
      });

      const newGroups = await getCollection<Group>(FIREBASE_COLLECTION_NAMES.GROUPS);
      setGroups(newGroups);

      enqueueSnackbar(`Group "${groupName}" was successfully edited.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to edit the group "${groupName}". Please try again.`, {
        variant: "error",
      });
      console.log("editing group failed: ", error);
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
        return (
          allGroups.filter(
            (existingGroup) => existingGroup.groupName === value && existingGroup.id !== group.id
          ).length === 0
        );
      })
      .required("Required"),
    configurationNames: Yup.array().of(Yup.string()),
    userEmails: Yup.array().min(1, "Required").of(Yup.string().email("Invalid email")),
  });

  return (
    <Formik
      initialValues={{
        groupName: group.groupName,
        userEmails: initialUserEmails,
      }}
      validationSchema={FORM_VALIDATION}
      enableReinitialize={true}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <Form>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Edit Group</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} marginY={2} alignItems="start">
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
    </Formik>
  );
};

export default GroupEditDialog;
