"use client";

// Приклад сторінки Licenses
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";

import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";

const ConfigurationsPage = () => {
  const { isLoading, userRole } = useProtectedRoute([
    USER_ROLE.ADMIN,
    USER_ROLE.EDITOR,
    USER_ROLE.VIEWER,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Configurations Page</h1>

      <p>Welcome, {userRole} user!</p>

      {userRole === USER_ROLE.ADMIN && (
        <div>
          <p>Special admin controls visible only to administrators.</p>
          {/* Додаткові елементи для адміністраторів */}
        </div>
      )}
      {/* Інші компоненти сторінки */}
    </div>
  );
};

export default ConfigurationsPage;
