// Utilidades para manejar JWT
export const getToken = () => {
  return localStorage.getItem("jwt_token");
};

export const setToken = (token) => {
  localStorage.setItem("jwt_token", token);
};

export const removeToken = () => {
  localStorage.removeItem("jwt_token");
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return true;
  }
};

export const getTokenPayload = (token) => {
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Error al decodificar el payload del token:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};
