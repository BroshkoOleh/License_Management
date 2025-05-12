"use client";
import { useEnhancedUser } from "../../store/storeHooks/useEnhancedUser";
import { USER_ROLE } from "../../utils/helpers/constants";
export default function LicensesContent() {
  const enhancedUser = useEnhancedUser();

  return (
    <div>
      <h1>Licenses Management</h1>

      <p>Welcome, {enhancedUser?.role} user!</p>

      {enhancedUser?.role === USER_ROLE.ADMIN && (
        <div>
          <p>Special admin controls visible only to administrators.</p>
          {/* Додаткові елементи для адміністраторів */}
        </div>
      )}
      {/* Інші компоненти сторінки */}
    </div>
  );
}
