const checkApiKeyExists = (req, res, next) => {
  const apiKey = req.headers["auth-token"];
  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }
  const validApiKey = process.env.CARBON_API_KEY;

  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};

export default checkApiKeyExists;
