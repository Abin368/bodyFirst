// components/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { authStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

const GuestRoute: React.FC<Props> = ({ children }) => {
  if (authStore.isAuthenticated) {
   
    if (authStore.role === "owner") return <Navigate to="/owner/dashboard" replace />;
    if (authStore.role === "trainer") return <Navigate to="/trainer/dashboard" replace />;
    if (authStore.role === "member") return <Navigate to="/member/dashboard" replace />;
  }
  return <>{children}</>;
};

export default GuestRoute;
