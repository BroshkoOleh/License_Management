"use client";

import ConfigurationsContent from "@/app/components/ConfigurationsContent/ConfigurationsContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";
const ConfigurationsPage = () => {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.EDITOR, USER_ROLE.VIEWER]}>
      <ConfigurationsContent />
    </ProtectedPage>
  );
};

export default ConfigurationsPage;
