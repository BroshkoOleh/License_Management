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
import { useLanguages } from "@/app/store/storeHooks/useLanguages";
import { Language } from "../../../types/types";
import { useStore } from "@/app/store/useStore";

interface LanguageAddDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface FormValues {
  languageName: string;
  languageCode: string;
}

const LanguageAddDialog = ({ open, handleClose }: LanguageAddDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setLanguages = useStore((state) => state.setLanguages);

  const allLanguages = useLanguages();

  //Submit
  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { languageCode, languageName } = values;

    const id = generateUID();

    // Close the dialog immediately
    handleClose();

    try {
      addEntry(FIREBASE_COLLECTION_NAMES.LANGUAGES, id, {
        id,
        languageCode,
        languageName,
      });

      const newLanguages = await getCollection<Language>(FIREBASE_COLLECTION_NAMES.LANGUAGES);
      setLanguages(newLanguages);

      enqueueSnackbar(`Language "${languageName}" was successfully added.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to add the language "${languageName}". Please try again.`, {
        variant: "error",
      });
      console.log("adding language failed: ", error);
    }
  };

  const FORM_VALIDATION = Yup.object().shape({
    languageCode: Yup.string()
      .test("is-language-code-unique", "Language Code is already used", (value) => {
        return (
          allLanguages.filter((language) => {
            return language.languageCode === value;
          }).length === 0
        );
      })
      .required("Required"),
    languageName: Yup.string()
      .test("is-language-name-unique", "Already used", (value) => {
        return (
          allLanguages.filter((language) => {
            return language.languageName === value;
          }).length === 0
        );
      })
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ languageCode: "", languageName: "" }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      <Form>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Add New Language</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} marginY={2} alignItems="start">
              <FormikTextfield
                name="languageName"
                fullWidth={true}
                label="Language Name"
                variant="standard"
              />
              <FormikTextfield
                name="languageCode"
                fullWidth={true}
                label="Language Code"
                variant="standard"
              />
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

export default LanguageAddDialog;
