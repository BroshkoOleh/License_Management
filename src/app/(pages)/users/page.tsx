"use client";

import UsersContent from "../../components/UsersContent/UsersContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";

function UsersPage() {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN]}>
      <UsersContent />
    </ProtectedPage>
  );
}
export default UsersPage;
