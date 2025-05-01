"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { USER_ROLE } from "../../utils/helpers/constants";
import LoadingSpinner from "../../components/Loading/LoadingSpinner/LoadingSpinner";

// //User Roles
// export const USER_ROLE = {
//   ADMIN: "Admin",
//   EDITOR: "Editor",
//   VIEWER: "Viewer",
// };

const FeaturesPage = () => {
  // Використовуємо хук захисту маршруту і вказуємо, що доступ має лише адміністратор
  const { isLoading } = useProtectedRoute([USER_ROLE.ADMIN]);

  // Відображаємо завантажувач, доки йде перевірка автентифікації
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Features Management</h1>
      <p>This page is only accessible by administrators.</p>
    </div>
  );
};

export default FeaturesPage;
