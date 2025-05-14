import { useSnackbar } from "notistack";
import { Formik, Form, FormikHelpers } from "formik";
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

import { Feature } from "../../../types/types";
import { useStore } from "@/app/store/useStore";
import { useFeatures } from "@/app/store/storeHooks/useFeatures";

const FEATURE_UUID_LENGTH = 36;

interface FeaturesAddDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface FormValues {
  featureName: string;
  uuid: string;
}

const FeaturesAddDialog = ({ open, handleClose }: FeaturesAddDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const allFeatures = useFeatures();
  const setFeatures = useStore((state) => state.setFeatures);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { featureName, uuid } = values;
    const id = generateUID();
    const isFormat = featureName
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

    // Close the dialog immediately
    handleClose();

    try {
      addEntry(FIREBASE_COLLECTION_NAMES.FEATURES, id, {
        id,
        uuid,
        featureName: isFormat,
      });

      const newFeatures = await getCollection<Feature>(FIREBASE_COLLECTION_NAMES.FEATURES);
      setFeatures(newFeatures);

      enqueueSnackbar(`Feature "${featureName}" was successfully added.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to add the feature "${featureName}". Please try again.`, {
        variant: "error",
      });
      console.log("adding feature failed: ", error);
    }
  };

  const isIdUnique: Yup.TestFunction<string | undefined, Yup.AnyObject> = function (value) {
    if (!value) return true;
    return !allFeatures.some((feat) => feat.uuid === value);
  };

  const FORM_VALIDATION = Yup.object().shape({
    uuid: Yup.string()
      .length(FEATURE_UUID_LENGTH, `Must be exactly ${FEATURE_UUID_LENGTH} characters long`)
      .test("is-uuid-unique", "Feature UUID is already used", isIdUnique)
      .required("Required"),
    featureName: Yup.string()
      .test("is-feature-name-unique", "Already used", (value) => {
        if (!value) return true;
        const formattedValue = value
          .split(" ")
          .map((word) => {
            if (word[0] && /^[a-zA-Z]$/.test(word[0])) {
              return word[0].toUpperCase() + word.slice(1);
            }
            return word;
          })
          .join(" ");

        return (
          allFeatures.filter((feature) => {
            return feature.featureName.localeCompare(formattedValue) === 0;
          }).length === 0
        );
      })
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ uuid: "", featureName: "" }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
    >
      <Form>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Add New Feature</DialogTitle>
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
            <Button sx={{ color: "red" }} onClick={handleClose}>
              Cancel
            </Button>
            <FormikButton sx={{ color: "green" }}>Save</FormikButton>
          </DialogActions>
        </Dialog>
      </Form>
    </Formik>
  );
};

export default FeaturesAddDialog;
