import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/users", (req, res) => {
  res.send("Hello World");
});

app.listen(3004, () => {
  console.log("Server is running on port 3004");
});
