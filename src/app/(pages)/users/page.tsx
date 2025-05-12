"use client";

import UsersContent from "@/app/components/UsersContent/UsersContent";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";
import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";
import { useStore } from "../../store/useStore";

const UsersPage = () => {
  const hasHydrated = useStore((state) => state.hasHydrated);

  const { isLoading } = useProtectedRoute([USER_ROLE.ADMIN]);

  return isLoading || !hasHydrated ? <LoadingSpinner /> : <UsersContent />;
};

export default UsersPage;
