import { createContext, useState, useEffect, useContext } from 'react';
import * as jwt from 'jsonwebtoken';
import { register, login, checkPermission } from '../api/auth';
import { useLocation } from 'react-router-dom';

const defaultAuthContext = {
  isAuthenticated: false, //使用者是否登入
  currentMember: null, //使用者當前相關資料
  register: null, //註冊方法
  login: null, //登入方法
  logout: null, // 登入方法
};

const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };
    checkTokenIsValid();
  }, [pathname]); //當pathname改變時，執行此函式

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
