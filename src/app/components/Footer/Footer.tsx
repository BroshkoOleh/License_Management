"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box id="footer" padding={2} sx={{ backgroundColor: "#403C8C" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} textAlign="center">
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            DevoMerce LLC
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            3833 Powerline Road, Suite 101
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            Fort Lauderdale, FL 33309, USA
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} textAlign="center">
          <Typography
            variant="subtitle2"
            sx={{ color: "white", cursor: "pointer" }}
            onClick={() => window.open("mailto:mail@brainssistance.com")}
          >
            Email: mail@brainssistance.com
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "white", cursor: "pointer" }}
            onClick={() => window.open("tel:+19542892701")}
          >
            Tel.: +1 954 289 2701
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} textAlign="center">
          <Typography
            variant="subtitle2"
            sx={{ color: "white", cursor: "pointer" }}
            onClick={() => window.open("https://www.brainssistance.com/privacy-policy", "_blank")}
          >
            Privacy Policy
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
