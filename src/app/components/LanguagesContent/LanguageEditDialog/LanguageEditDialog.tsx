import { useSnackbar } from "notistack";
import { Formik, FormikHelpers, FormikProps, Form } from "formik";
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

// import { EMAILER_URL, USER_ROLE } from "../../utils/helpers/constants";
import { Language } from "../../../types/types";
import { useLanguages } from "@/app/store/storeHooks/useLanguages";
import { useStore } from "@/app/store/useStore";

interface LanguageEditDialogProps {
  open: boolean;
  handleClose: () => void;
  language: Language;
}
interface FormValues {
  languageName: string;
  languageCode: string;
}

const LanguageEditDialog = ({ open, handleClose, language }: LanguageEditDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const allLanguages = useLanguages();
  const setLanguages = useStore((state) => state.setLanguages);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { languageName, languageCode } = values;

    if (languageName === language.languageName && languageCode === language.languageCode) {
      resetForm();
      handleClose();
      return;
    }

    // Close the dialog immediately
    handleClose();

    try {
      updateEntry(FIREBASE_COLLECTION_NAMES.LANGUAGES, language.id, {
        languageCode,
        languageName,
      });

      const newLanguages = await getCollection<Language>(FIREBASE_COLLECTION_NAMES.LANGUAGES);
      setLanguages(newLanguages);
      enqueueSnackbar(`Language "${languageName}" was successfully edited.`, {
        variant: "success",
      });

      resetForm();
    } catch (error) {
      enqueueSnackbar(`Failed to edit the language "${languageName}". Please try again.`, {
        variant: "error",
      });
      console.log("editing language failed: ", error);
    }
  };

  const FORM_VALIDATION = Yup.object().shape({
    languageName: Yup.string()
      .test("is-language-name-unique", "Already used", (value) => {
        if (!value || value === language.languageName) {
          return true; // Ignore validation if the value is the same as the current language name
        }
        return (
          allLanguages.filter((lang) => {
            return lang.languageName === value;
          }).length === 0
        );
      })
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{
        languageCode: language.languageCode,
        languageName: language.languageName,
      }}
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
            <DialogTitle>Edit Language</DialogTitle>
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

export default LanguageEditDialog;
