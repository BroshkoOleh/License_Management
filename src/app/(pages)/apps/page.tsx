"use client";
import AppsContent from "@/app/components/AppsContent/AppsContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";
const AppsPage = () => {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN]}>
      <AppsContent />
    </ProtectedPage>
  );
};

export default AppsPage;
