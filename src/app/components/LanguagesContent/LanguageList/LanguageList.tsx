import List from "@mui/material/List";
import LanguageListItem from "../LanguageListItem/LanguageListItem";
import { alphanumericSort } from "../../../utils/helpers/helpers";
import useDebounce from "../../../hooks/useDebounce";
import { warningNoLanguagesResults } from "../../../utils/helpers/warnings";
import { Typography } from "@mui/material";
import { useLanguages } from "@/app/store/storeHooks/useLanguages";
import { useStore } from "../../../store/useStore";

const LanguageList = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const languages = useLanguages();

  console.log("languages", languages);

  const queryItems = useStore((state) => state.searchString);
  const debounceQuery = useDebounce(queryItems, 500);

  const visibleLanguages = languages
    .filter(
      (lang) =>
        lang.languageName.toLowerCase().includes(debounceQuery.toLowerCase()) ||
        lang.languageCode.toLowerCase().includes(debounceQuery.toLowerCase())
    )
    .sort((a, b) => alphanumericSort(a, b, "languageName"));

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <List>
      {visibleLanguages.length > 0 ? (
        visibleLanguages.map((language, idx) => <LanguageListItem key={idx} language={language} />)
      ) : (
        <Typography textAlign="center">{warningNoLanguagesResults}</Typography>
      )}
    </List>
  );
};

export default LanguageList;
