import { useContext } from "react";
import { AuthContext } from "@/app/app/AuthContext"; // Import the type definition

// NOTE: You would typically export AuthContext and the type from AuthContext.tsx

export const useAuth = () => {
  // 1. Consume the context
  const context = useContext(AuthContext);

  // 2. Error handling: Ensure the hook is used inside the Provider
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // 3. Return the context value
  return context;
};
