import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CustomerService from "../services/CustomerService";
 
const TierCard = ({ email, token }) => {
  const [tierData, setTierData] = useState(null);
  const [animatedPoints, setAnimatedPoints] = useState(0);
 
  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const data = await CustomerService.getTiersByEmail(email, token);
        // const data = {
        //   currentTier: "Free Tier",
        //   nextTier: "Silver",
        //   totalPoints: 7653.0,
        //   leftPointsToReachNextTier: 15000.0,
        //   tierId: "eb2c581f-b3c1-46f1-8d15-52724b49f1ba",
        //   colour: "#88cdf6",
        // };
        setTierData(data);
      } catch (error) {
        console.error("Error fetching tier data:", error);
      }
    };
    fetchTierData();
  }, [email, token]);
 
  useEffect(() => {
    if (!tierData) return;
 
    const { totalPoints } = tierData;
    let animationFrame;
    const duration = 2000;
    const startTime = performance.now();
 
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      setAnimatedPoints(Math.floor(progress * totalPoints));
 
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
 
    animationFrame = requestAnimationFrame(animate);
 
    return () => cancelAnimationFrame(animationFrame);
  }, [tierData]);
 
  if (!tierData) {
    return <Typography>Loading...</Typography>;
  }
 
  const { colour, currentTier, nextTier, totalPoints, leftPointsToReachNextTier } = tierData;
  const gradientColor = colour || "#FFFFFF";
 
  return (
<Card
      sx={{
        background: `linear-gradient(to bottom right, #FFF8DC, ${gradientColor})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "1000px",
        margin: "0 auto",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
      }}
>
<CardContent sx={{ textAlign: "left", width: "100%" }}>
<Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
            mb: 5,
          }}
>
          {currentTier}
</Typography>
 
        <Box
          sx={{
            width: "100%",
            mt: 3,
            position: "relative",
            height: "20px",
            borderRadius: "10px",
            backgroundColor: "#e7ceadc2",
            overflow: "visible",
          }}
>
          {/* Progress */}
<Box
            sx={{
              position: "absolute",
              width: `${(animatedPoints / (totalPoints + leftPointsToReachNextTier)) * 100}%`,
              height: "100%",
              background: "white",
              backgroundSize: "200% 200%",
              borderRadius: "10px",
              animation: "shinyBar 2s linear infinite",
              "@keyframes shinyBar": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          />
 
          {/* Current Tier Label */}
<Typography
            sx={{
              position: "absolute",
              top: "-20px",
              left: "0",
              fontWeight: "bold",
              color: "#333",
              fontSize: "0.9rem",
              zIndex: 1,
            }}
>
            {currentTier}
</Typography>
 
          {/* Next Tier Label */}
<Typography
            sx={{
              position: "absolute",
              top: "-20px",
              right: "0",
              fontWeight: "bold",
              color: "#333",
              fontSize: "0.9rem",
              zIndex: 1,
            }}
>
            {nextTier}
</Typography>
 
          {/* Points at Progress */}
<Typography
            sx={{
              position: "absolute",
              bottom: "-20px",
              left: `${(animatedPoints / (totalPoints + leftPointsToReachNextTier)) * 100}%`,
              transform: "translateX(-50%)",
              fontWeight: "bold",
              color: "#555",
              fontSize: "0.8rem",
              zIndex: 1,
            }}
>
            {animatedPoints} Points
</Typography>
 
          {/* Points to Next Tier */}
<Typography
            sx={{
              position: "absolute",
              bottom: "-20px",
              right: "0",
              fontWeight: "bold",
              color: "#E63946",
              fontSize: "0.9rem",
              zIndex: 1,
            }}
>
            {leftPointsToReachNextTier} Points
</Typography>
</Box>
</CardContent>
</Card>
  );
};
 
export default TierCard;