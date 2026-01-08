import express from "express";

const app = express();
app.use(express.json({limit:"10mb"}));

app.post("/upload", async (req,res)=>{
  const { imageDataUrl } = req.body;
  if(!imageDataUrl) return res.sendStatus(400);

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const base64 = imageDataUrl.split(",")[1];
  const buffer = Buffer.from(base64,"base64");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", new Blob([buffer],{type:"image/jpeg"}),"photo.jpg");

  const tg = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
    {method:"POST", body:form}
  );

  res.json({ok: tg.ok});
});

app.listen(process.env.PORT||3000);
