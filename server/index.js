import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

console.log("OPENAI KEY loaded?", !!process.env.OPENAI_API_KEY);

app.get("/", (req,res) => {
  res.send("NutriGPT proxy OK");
});

app.get("/health", (req, res) => {
  res.json({ok:true, model: "gpt-4o"});
});

app.post("/api/chat", async(req, res) => {
  const { messages } = req.body;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify ({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await r.json();

    if(!r.ok) {

     console.error("❗️OpenAI Error:", r.status, JSON.stringify(data, null, 2));
    }
      return res.status(r.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"OpenAI proxy error"});    
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

