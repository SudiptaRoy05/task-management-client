
import { getAuth } from "firebase/auth";
export const AuthContext = createContext(null);
const auth = getAuth();

export default function AuthProvider({ children }) {
  
  const authInfo = {
    auth,
  };
  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  )
}
