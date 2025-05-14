import List from "@mui/material/List";
import FeaturesListItem from "../FeaturesListItem/FeaturesListItem";
import { alphanumericSort } from "../../../utils/helpers/helpers";
import useDebounce from "../../../hooks/useDebounce";
import { warnignNoFeatureResults } from "../../../utils/helpers/warnings";
import { Typography } from "@mui/material";
import { useFeatures } from "@/app/store/storeHooks/useFeatures";
import { useStore } from "../../../store/useStore";

const FeaturesList = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const features = useFeatures();

  const queryItems = useStore((state) => state.searchString);
  const debounceQuery = useDebounce(queryItems, 500);

  const visibleFeatures = features
    .filter(
      (feature) =>
        feature.featureName.toLowerCase().includes(debounceQuery.toLowerCase()) ||
        feature.uuid.toLowerCase().includes(debounceQuery.toLowerCase())
    )
    .sort((a, b) => alphanumericSort(a, b, "featureName"));

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <List>
      {visibleFeatures.length > 0 ? (
        visibleFeatures.map((feature, idx) => <FeaturesListItem key={idx} feature={feature} />)
      ) : (
        <Typography textAlign="center">{warnignNoFeatureResults}</Typography>
      )}
    </List>
  );
};

export default FeaturesList;
