"use client";

import GroupsContent from "@/app/components/GroupsContent/GroupsContent";
import ProtectedPage from "@/app/components/Authentication/ProtectedPage/ProtectedPage";
import { USER_ROLE } from "../../utils/helpers/constants";
const GroupsPage = () => {
  return (
    <ProtectedPage allowedRoles={[USER_ROLE.ADMIN]}>
      <GroupsContent />
    </ProtectedPage>
  );
};

export default GroupsPage;
