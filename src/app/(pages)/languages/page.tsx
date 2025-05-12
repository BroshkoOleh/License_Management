"use client";

import LanguagesContent from "@/app/components/LanguagesContent/LanguagesContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";
const LanguagesPage = () => {
  return (
        <ProtectedPage allowedRoles={[USER_ROLE.ADMIN]}>
      <LanguagesContent />
    </ProtectedPage>
  );
};

export default LanguagesPage;
