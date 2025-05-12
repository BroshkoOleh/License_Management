"use client";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import FeaturesContent from "@/app/components/FeaturesContent/FeaturesContent";
import { USER_ROLE } from "../../utils/helpers/constants";
const FeaturesPage = () => {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN]}>
      <FeaturesContent />
    </ProtectedPage>
  );
};

export default FeaturesPage;
