import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { isUserAdmin } from "../firebase/admin-check";

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      if (!user) { setChecking(false); return; }
      try {
        const result = await isUserAdmin(user.uid);
        setIsAdmin(result);
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    }
    check();
  }, [user]);

  return { isAdmin, checking };
}
