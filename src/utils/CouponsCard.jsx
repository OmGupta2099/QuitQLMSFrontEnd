import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Modal,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Utility function to lighten colors
const lightenColor = (color, percent) => {
  const num = parseInt(color?.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `rgb(${Math.min(R, 255)}, ${Math.min(G, 255)}, ${Math.min(B, 255)})`;
};

// Utility function to determine appropriate text color
const getTextColor = (color) => {
  const r = parseInt(color?.substring(1, 3), 16);
  const g = parseInt(color?.substring(3, 5), 16);
  const b = parseInt(color?.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const CouponsCard = ({ coupon, color }) => {
  const [openInfoModal, setOpenInfoModal] = useState(false);

  const lightColor = lightenColor(color, 60);
  const textColor = getTextColor(color);

  const handleInfoModalOpen = () => setOpenInfoModal(true);
  const handleInfoModalClose = () => setOpenInfoModal(false);

  // Determine the band text and style based on coupon status
  let bandText = "";
  let bandColor = "";
  let bandBackgroundColor = "";

  if (coupon.status === "USED") {
    bandText = `Redeemed on ${new Date(coupon.couponUsedDate).toLocaleDateString()}`;
    bandColor = "#ffffff";
    bandBackgroundColor = "rgba(0, 0, 0, 0.5)";
  } else if (coupon.status === "EXPIRED") {
    bandText = "EXPIRED";
    bandColor = "#ffffff";
    bandBackgroundColor = "red";
  }

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          width: "300px",
          height: "234px",
          background:
            coupon.status === "ACTIVE"
              ? `linear-gradient(to bottom right, ${lightColor}, ${color})`
              : 'linear-gradient(to bottom right, #9e968b, #373738)',
          borderRadius: 8,
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
          color: textColor,
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                textTransform: "uppercase",
                maxWidth: "150px",
                color: textColor,
              }}
            >
              {coupon.couponCode}
            </Typography>
            <Chip
              label={coupon.status}
              size="small"
              sx={{
                color: "#fff",
                backgroundColor: color,
                cursor: "pointer",
              }}
            />
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.5)" }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: textColor }}>
              Issued On: <span style={{ fontWeight: "normal" }}>{new Date(coupon.issuedOn).toLocaleDateString()}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: textColor }}>
              Expiry: <span style={{ fontWeight: "normal" }}>{new Date(coupon.expiry).toLocaleDateString()}</span>
            </Typography>
          </Box>
        </CardContent>

        {bandText && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: bandBackgroundColor,
              color: bandColor,
              textAlign: "center",
              py: 0.5,
            }}
          >
            {bandText}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            marginTop: "-10px",
            paddingBottom: "10px",
            backgroundColor: lightenColor(color, 30),
            borderTop: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <IconButton
            aria-label="info"
            onClick={handleInfoModalOpen}
            sx={{ color: textColor }}
          >
            <InfoIcon />
          </IconButton>
        </Box>
      </Card>

      <Modal
        open={openInfoModal}
        onClose={handleInfoModalClose}
        aria-labelledby="info-modal-title"
        aria-describedby="info-modal-description"
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
          }}
        >
          <Typography
            id="info-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, color: textColor }}
          >
            Coupon Details
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
            <strong>Coupon Code:</strong> {coupon.couponCode}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
            <strong>Issued On:</strong> {new Date(coupon.issuedOn).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
            <strong>Expiry:</strong> {new Date(coupon.expiry).toLocaleDateString()}
          </Typography>
          {coupon.status === "USED" && (
            <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
              <strong>Used On:</strong> {new Date(coupon.couponUsedDate).toLocaleDateString()}
            </Typography>
          )}

          <Button
            onClick={handleInfoModalClose}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CouponsCard;
