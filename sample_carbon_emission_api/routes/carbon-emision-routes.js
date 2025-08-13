import express from "express";

const carbonEmisionRoutes = express.Router();
const carbonIntensityData = {
  // Americas
  "us-east-1": { carbonIntensity: 378 },
  "us-east-2": { carbonIntensity: 399 },
  "us-west-1": { carbonIntensity: 212 },
  "us-west-2": { carbonIntensity: 111 },
  "ca-central-1": { carbonIntensity: 130 },
  "ca-west-1": { carbonIntensity: 13 },
  "sa-east-1": { carbonIntensity: 71 },

  // Europe, Middle East, Africa
  "eu-west-1": { carbonIntensity: 282 },
  "eu-west-2": { carbonIntensity: 225 },
  "eu-west-3": { carbonIntensity: 40 },
  "eu-central-1": { carbonIntensity: 337 },
  "eu-central-2": { carbonIntensity: 13 },
  "eu-north-1": { carbonIntensity: 12 },
  "eu-south-1": { carbonIntensity: 243 },
  "eu-south-2": { carbonIntensity: 172 },
  "af-south-1": { carbonIntensity: 735 },
  "il-central-1": { carbonIntensity: 475 },
  "me-south-1": { carbonIntensity: 433 },
  "me-central-1": { carbonIntensity: 395 },

  // Asia-Pacific
  "ap-east-1": { carbonIntensity: 622 },
  "ap-northeast-1": { carbonIntensity: 436 },
  "ap-northeast-2": { carbonIntensity: 416 },
  "ap-northeast-3": { carbonIntensity: 436 },
  "ap-south-1": { carbonIntensity: 574 },
  "ap-south-2": { carbonIntensity: 569 },
  "ap-southeast-1": { carbonIntensity: 393 },
  "ap-southeast-2": { carbonIntensity: 526 },
  "ap-southeast-3": { carbonIntensity: 247 },
  "ap-southeast-4": { carbonIntensity: 524 },
};

carbonEmisionRoutes.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to the Carbon Emission API. Use /carbon-intensity/latest?zone=us-east-1 to get data for a specific AWS region.",
  });
});

carbonEmisionRoutes.get("/carbon-intensity/latest", (req, res) => {
  const zone = req.query.zone;

  if (!zone) {
    return res
      .status(400)
      .json({ error: "The 'zone' query parameter is required." });
  }

  const regionData = carbonIntensityData[zone];
  if (regionData) {
    return res.status(200).json({
      zone: zone,
      carbonIntensity: regionData.carbonIntensity,
      datetime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      emissionFactorType: "lifecycle",
      isEstimated: true,
      estimationMethod: "GENERAL_PURPOSE_ZONE_MODEL",
      temporalGranularity: "hourly",
    });
  } else {
    // If no data is found, return a 404 Not Found error
    return res.status(404).json({
      error: "Data not found for the specified zone.",
      zone: zone,
      availableZones: Object.keys(carbonIntensityData), // List all valid zones
    });
  }
});

export default carbonEmisionRoutes;
