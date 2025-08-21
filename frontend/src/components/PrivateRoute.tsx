

import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
    children : React.ReactNode;
}

const PrivateRoute:React.FC<PrivateRouteProps> = ({children}) => {

    let token= localStorage.getItem('accessToken')
    if(!token){
        return <Navigate to='/login' replace/>
    }
  return <>{children}</>
  
}

export default PrivateRoute