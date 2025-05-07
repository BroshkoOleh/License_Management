import { redirect } from "next/navigation";
import { db } from "../../utils/firebase/firebaseAdmin";
import { cookies } from "next/headers";
import { getFirebaseAdmin } from "../../utils/firebase/firebaseAdmin";
import UsersContent from "../../components/UsersContent/UsersContent";

async function getVerification() {
  console.log("getVerification");
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("authToken")?.value;

    if (!sessionCookie) {
      return null;
    }

    // Верифікуємо сесійний токен
    const admin = getFirebaseAdmin();
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    if (!decodedClaims) {
      return null;
    }
    const userEmail = decodedClaims.email;
    if (!userEmail) {
      console.error("Email not found in token claims");
      return null;
    }
    return userEmail;
  } catch (error) {
    console.error("Error getting verification:", error);
    return null;
  }
}

async function getUserRole(email: string) {
  console.log("getUserRole");
  try {
    if (!email) {
      console.error("Email not found in token claims");
      return null;
    }
    const userDoc = await db.collection("users").doc(email).get();
    const userData = userDoc.data();
    if (!userDoc.exists) {
      return null;
    }

    const userRole = userData?.role;

    return userRole;
  } catch (error) {
    console.error("Error getting the role of user:", error);
    return null;
  }
}

async function getUsers() {
  try {
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      console.log("No users found");
      return [];
    }

    const users = snapshot.docs.map((doc) => {
      const userData = doc.data();

      return JSON.parse(
        JSON.stringify({
          id: doc.id,
          ...userData,
          createdAt:
            userData.createdAt && userData.createdAt.toDate
              ? userData.createdAt.toDate().toISOString()
              : userData.createdAt,
        })
      );
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export default async function UsersPage() {
  // Перевіряємо автетифікацію
  const verification = await getVerification(); // повертає email юзера
  // Якщо користувач не авторизований, перенаправляємо на головну сторінку
  if (!verification) {
    redirect("/");
  }
  const userRole = await getUserRole(verification);

  // Перевіряємо роль користувача (з перевіркою, що role існує)
  if (!userRole || userRole !== "Admin") {
    redirect("/licenses");
  }

  // Отримуємо дані користувачів
  const users = await getUsers();

  return <UsersContent users={users} />;
}
