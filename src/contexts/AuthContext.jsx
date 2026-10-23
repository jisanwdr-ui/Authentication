import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getUserByEmail,
  getUserById,
  checkUsername as checkUsernameApi,
  createUser,
} from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user after refresh
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getUserById(userId);
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("userId");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login
  const login = async ({ email, password }) => {
    const users = await getUserByEmail(email);

    const foundUser = users.find(
      (item) => item.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("userId", foundUser.id);
    setUser(foundUser);

    return foundUser;
  };

  // Register
  const register = async (userData) => {
    const usernameExists = await checkUsernameApi(
      userData.username
    );

    if (usernameExists) {
      throw new Error("Username already exists");
    }

    const existingUsers = await getUserByEmail(
      userData.email
    );

    if (existingUsers.length > 0) {
      throw new Error("Email already exists");
    }

    const newUser = await createUser({
      ...userData,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("userId", newUser.id);
    setUser(newUser);

    return newUser;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  // Check authentication
  const isAuthenticated = () => Boolean(user);

  // Check username
  const checkUsername = async (username) => {
    return checkUsernameApi(username);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        checkUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);