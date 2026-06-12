// src/theme.ts
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/montserrat/400.css"; 
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

const theme = extendTheme({
  colors: {
    brandOrange: "#f07a22",
    brandBlue: "#4e6d80",
    brandYellow: "#f6b83d",
    brandSoftOrange: "#fff3e8",
    brandSoftBlue: "#e8f0f5",
    darkGray: "#2f2f2f",
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Montserrat', sans-serif",
  },
  // O Chakra v2 aplica fontes automaticamente se definidas aqui
});

export default theme;