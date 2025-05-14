import List from "@mui/material/List";
import AppListItem from "../AppListItem/AppListItem";
import { alphanumericSort } from "../../../utils/helpers/helpers";
import useDebounce from "../../../hooks/useDebounce";
import { warningNoAppsResults } from "../../../utils/helpers/warnings";
import { Typography } from "@mui/material";
import { useStore } from "../../../store/useStore";
import { useApps } from "@/app/store/storeHooks/useApps";

const AppList = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const apps = useApps();
  const queryItems = useStore((state) => state.searchString);
  const debounceQuery = useDebounce(queryItems, 500);

  const visibleApps = apps
    .filter(
      (app) =>
        app.appName.toLowerCase().includes(debounceQuery.toLowerCase()) ||
        app.uuid.toLowerCase().includes(debounceQuery.toLowerCase())
    )
    .sort((a, b) => alphanumericSort(a, b, "appName"));

  if (!hasHydrated) {
    return <div></div>;
  }

  return (
    <List>
      {visibleApps.length > 0 ? (
        visibleApps.map((app, idx) => <AppListItem key={idx} app={app} />)
      ) : (
        <Typography textAlign="center">{warningNoAppsResults}</Typography>
      )}
    </List>
  );
};

export default AppList;
