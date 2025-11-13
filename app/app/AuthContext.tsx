import { createContext, useEffect, useState, ReactNode } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { app } from "@/lib/firebaseLib"; // Assuming this imports your Firebase app config

// 1. Define the shape of the context data
export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  // Placeholder functions for now (you'll implement login/logout logic later)
  login: () => void;
  logout: () => void;
}

// 2. Create the Context with default/initial values
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// 3. Define the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true); // Start loading state as true

  const auth = getAuth(app);

  // Implement the Firebase Listener
  useEffect(() => {
    // This listener runs once on mount and every time the user's auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Authentication state has been checked, set loading to false
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  // Placeholder functions (to be replaced with actual Firebase auth calls)
  const login = () => {
    console.log("Login function called");
  };
  const logout = () => {
    console.log("Logout function called");
  };

  // 4. Define the value passed to consumers
  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Optional: Show a loading screen while auth is being checked */}
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
