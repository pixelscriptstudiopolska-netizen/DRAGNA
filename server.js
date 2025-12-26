const express = require("express");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));
const cors = require("cors");
const app = express();

const WEBHOOK_URL = "https://discord.com/api/webhooks/1454100598289858776/f76cCeAFO3d4te5JLh1b_KpS8Rlt9Ip2JCorDg4GFgEbIftQ8B19zU7wYTiyL0lxedNm";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function fmt(n){
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ");
}

app.post("/order", async (req,res)=>{
  const o = req.body;

  const embed = {
    title:"🩸NOWE ZAMÓWIENIE🩸",
    color:16711680,
    fields:[
      {name:"Organizacja",value:o.orgName},
      {name:"Telefon IC",value:o.phoneIC},
      {name:"Szef Discord",value:o.bossDiscord},
      {name:"Szef FiveM",value:o.bossFiveM},
      {
        name:"Zamówienie",
        value:o.items.map(i=>
          `${i.name} x${i.qty} | ${fmt(i.qty*i.price)}$`
        ).join("\n")
      },
      {name:"💰 Suma",value:`${fmt(o.total)}$`},
      {name:"Upoważnienie",value:o.authorized}
    ]
  };

  await fetch(WEBHOOK_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({embeds:[embed]})
  });

  res.json({ok:true});
});

app.listen(3000,()=>console.log("WWF działa na 3000"));
