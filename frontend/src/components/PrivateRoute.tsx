import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "@/store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
});

export default PrivateRoute;
