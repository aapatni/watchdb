import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#DAA520", // Gold color for a vintage look
    },
    secondary: {
      main: "#8B4513", // SaddleBrown for a touch of the old leather
    },
    background: {
      default: "#FFF8DC", // Cornsilk background for a light, airy feel
      paper: "#FAEBD7", // AntiqueWhite for paper elements to add to the vintage theme
      backMost: "#F5F5DC", // Beige for the furthest back elements, keeping it light and neutral
    },
    text: {
      primary: "#000000", // Black text for contrast on the light background
      secondary: "#333333", // Dark gray for secondary text, softer than black
    },
  },
  typography: {
    fontFamily: "'Playfair Display', serif", // A font that mimics 1800s style but is readable
    allVariants: {
      color: "#000000", // Ensuring text is primarily black for readability
    },
  },
  sidebar: {
    width: '20vw'
  },
  custom: {
    svgColor: "#C0A080", // A muted gold to complement the primary color and add a modern twist
  },

  PagePaperMargins: {
    margin: "1%"
  }

});

export default theme;
