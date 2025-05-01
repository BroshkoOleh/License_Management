"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";

const LanguagesPage = () => {
  const { isLoading } = useProtectedRoute([USER_ROLE.ADMIN]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Languages Page</h1>
      <p>This page is only accessible by administrators.</p>
    </div>
  );
};

export default LanguagesPage;
