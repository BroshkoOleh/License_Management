"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";
import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";

const AppsPage = () => {
  const { isLoading } = useProtectedRoute([USER_ROLE.ADMIN]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Apps Page</h1>
      <p>This page is only accessible by administrators.</p>
    </div>
  );
};

export default AppsPage;
