import { useSnackbar } from "notistack";
import { Formik, FormikHelpers, Form } from "formik";
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

import { Feature } from "../../../types/types";

import { useStore } from "@/app/store/useStore";
import { useFeatures } from "@/app/store/storeHooks/useFeatures";

interface FeaturesEditDialogProps {
  open: boolean;
  handleClose: () => void;
  feature: Feature;
}
interface FormValues {
  featureName: string;
  uuid: string;
}

const FeaturesEditDialog = ({ open, handleClose, feature }: FeaturesEditDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const allFeatures = useFeatures();
  const setFeatures = useStore((state) => state.setFeatures);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { featureName, uuid } = values;

    if (featureName === feature.featureName && uuid === feature.uuid) {
      handleClose();
      resetForm();

      return;
    }

    // Close the dialog immediately
    handleClose();

    const isFormat = featureName
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

    try {
      await updateEntry(FIREBASE_COLLECTION_NAMES.FEATURES, feature.id, {
        id: feature.id,
        featureName: isFormat,
        uuid,
      });

      const newFeatures = await getCollection<Feature>(FIREBASE_COLLECTION_NAMES.FEATURES);
      setFeatures(newFeatures);

      enqueueSnackbar(`Feature "${featureName}" was successfully edited.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to edit the feature "${featureName}". Please try again.`, {
        variant: "error",
      });
      console.log("Editing feature failed: ", error);
    }
  };

  const FORM_VALIDATION = Yup.object().shape({
    featureName: Yup.string()
      .test("is-feature-name-unique", "Already used", (value) => {
        if (!value || value === feature.featureName) {
          return true; // Ignore validation if the value is the same as the current feature name
        }
        return (
          allFeatures.filter((feature) => {
            return feature.featureName.localeCompare(value) === 0;
          }).length === 0
        );
      })
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ featureName: feature.featureName, uuid: feature.uuid }}
      validationSchema={FORM_VALIDATION}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ resetForm }) => (
        <Form>
          <Dialog
            open={open}
            onClose={() => {
              resetForm();
              handleClose();
            }}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Edit Feature</DialogTitle>
            <DialogContent>
              <Stack direction="column" spacing={2} marginY={2} alignItems="start">
                <FormikTextfield
                  name="featureName"
                  fullWidth={true}
                  label="Feature Name"
                  variant="standard"
                />
                <FormikTextfield name="uuid" fullWidth label="Feature UUID" variant="standard" />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                sx={{ color: "red" }}
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <FormikButton type="submit" sx={{ color: "green" }}>
                Save
              </FormikButton>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default FeaturesEditDialog;
