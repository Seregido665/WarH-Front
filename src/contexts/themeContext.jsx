import React, { createContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const storagedTheme = window.localStorage.getItem('user_theme')
  const [theme, setTheme] = useState(storagedTheme || 'light');

  const handleChangeTheme = () => {
    setTheme((actualTheme) => {
      window.localStorage.setItem('user_theme', actualTheme === 'light' ? 'dark' : 'light')
      return actualTheme === 'light' ? 'dark' : 'light'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
