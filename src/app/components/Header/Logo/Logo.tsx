import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";

export default function Logo() {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Box display="flex" alignItems={"center"} justifyContent="center" gap="20px">
      <img
        style={
          isSmallScreen ? { width: "30px", height: "30px" } : { width: "40px", height: "40px" }
        }
        alt="logo"
        src="/LogoBrainssistanceWhite.png"
      />
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1,
          alignSelf: "center",
          display: { xs: "none", sm: "block" },
        }}
      >
        LICENSE MANAGEMENT
      </Typography>
    </Box>
  );
}
