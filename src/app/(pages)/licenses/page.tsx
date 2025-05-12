"use client";

import LicensesContent from "@/app/components/LicensesContent/LicensesContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";
const LicensesPage = () => {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.EDITOR, USER_ROLE.VIEWER]}>
      <LicensesContent />
    </ProtectedPage>
  );
};

export default LicensesPage;
