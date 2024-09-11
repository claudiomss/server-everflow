const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const app = express()
const https = require("https")
const fs = require("fs")
const axios = require("axios")

const supabaseUrl = "https://jhaezscwymystvfwagaq.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoYWV6c2N3eW15c3R2ZndhZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1MzcyNjgsImV4cCI6MjAzODExMzI2OH0.ZxUK3J9W6Y_mpGSwthmj6L14PnwrXDrFCdIM1PrmIVA"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const cors = require("cors")
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/servertt.online/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/servertt.online/fullchain.pem"),
}

// Middleware para lidar com JSON no corpo da requisição
app.use(express.json())
app.use(cors())

// Ou configure de forma mais específica
app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*")
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  app.use(cors())
  next()
})

app.get("/", cors(), async (req, res) => {
  res.status(200).send("Rodando")
})

// Funções auxiliares para extrair partes dos parâmetros
function extractCampaignName(campaign) {
  return campaign.split("|")[0]
}

function extractCampaignId(campaign) {
  return campaign.split("|")[1]
}

function extractAdsetName(medium) {
  return medium.split("|")[0]
}

function extractAdsetId(medium) {
  return medium.split("|")[1]
}

function extractAdName(content) {
  return content.split("|")[0]
}

function extractAdId(cmcAdid) {
  return cmcAdid ? cmcAdid.replace(/^\[|\]$/g, "") : "" // Ajuste conforme necessário
}

function getPixel(pixelName) {
  const accessToken_CLD =
    "EAAL1DetdEEUBO6FW7FFAa7uESZCaC1QBdok77gT5BGWBYwORbZBD44MGatJaG8YMRURF7ZCA6Ehj9Eh0FhLDgoudB0ozp4u5iAuk5VmotabYF4JHB1Lkwsf5yQV5huWWXPqL0ZCKkIKYbjpASXxRbNMiIP9fsUNuWUZBKGEZAUVJufNuZBpDqorLp7lZBlxJOEtjPgZDZD"
  const pixelId_CLD = "468525639505628"

  const accessToken_VN =
    "EAAGyx4TrTyIBOwSUOMlAK2sN1fVwT2E0SCItWqqGKmn7MFNfH9mtJcOz7JIO8KDifTULAAbtZCq8S8357y7xZBuoXFG9vb5AYII1ZAV6w4ZBVETZAqaruoAsnnVz6ZAUuyDZBAjeVVPAVKZCOi7yqGZClrlzdtx95MQdRuad3CVbbi6UnPjEFesBHWoMpvZCV1wQZDZD"
  const pixelId_VN = "8194482793967044"

  if (pixelName == "Claudio") {
    return {
      token: accessToken_CLD,
      pixelID: pixelId_CLD,
    }
  }

  if (pixelName == "Vinni") {
    return {
      token: accessToken_VN,
      pixelID: pixelId_VN,
    }
  }
}

app.post("/InitiateCheckout", cors(), async (req, res) => {
  const dataReq = req.body
  const { _fbc, _fbp, requestNumber, urlCamp, pixelName } = dataReq

  const url = await urlCamp
  const urlObj = new URL(url)
  const urlParams = new URLSearchParams(urlObj.search)

  const utmSource = urlParams.get("utm_source")
  const utmCampaign = urlParams.get("utm_campaign")
  const utmMedium = urlParams.get("utm_medium")
  const utmContent = urlParams.get("utm_content")
  const cmcAdid = urlParams.get("xcod") // Utilizando 'xcod' para obter o 'cmc_adid'

  const data = {
    client_ip_address:
      req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    client_user_agent: req.headers["user-agent"],
    fbc: _fbc, // Recebendo os cookies via body
    fbp: _fbp, // Recebendo os cookies via body
    event_source_url: url, // Recebendo a URL de origem via body
    value: 160.0, // Valor da compra
    content_ids: ["ultra male"], // IDs dos conteúdos comprados
    contents: [{ id: "ultra male", quantity: 1 }], // Informações sobre os conteúdos comprados
    campaignName: extractCampaignName(utmCampaign),
    campaignId: extractCampaignId(utmCampaign),
    adsetName: extractAdsetName(utmMedium),
    adsetId: extractAdsetId(utmMedium),
    adName: extractAdName(utmContent),
    adId: extractAdId(cmcAdid),
  }

  const pixelData = getPixel(pixelName)
  const accessToken = pixelData.token
  const pixelId = pixelData.pixelID

  const urlFace = `https://graph.facebook.com/v13.0/${pixelId}/events`

  const eventData = {
    data: [
      {
        event_name: "InitiateCheckout",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: data.event_source_url,
        user_data: {
          client_ip_address: data.client_ip_address,
          client_user_agent: data.client_user_agent,
          fbc: data.fbc,
          fbp: data.fbp,
        },
        custom_data: {
          currency: "BRL",
          value: data.value,
          content_ids: data.content_ids,
          contents: data.contents,
          content_type: "product",
          utm_source: data.campaignName,
          utm_campaign: `${data.campaignName}|${data.campaignId}`,
          utm_medium: `${data.adsetName}|${data.adsetId}`,
          utm_content: data.adName,
          cmc_adid: `fb_${data.adId}`,
        },
      },
    ],
    access_token: accessToken,
  }

  await Promise.allSettled([
    supabase.from("InitiateCheckout").insert({
      fbc: _fbc,
      fbp: _fbp,
      requestNumber: requestNumber,
      urlCamp: urlCamp,
      pixel: pixelName,
      utm_source: data.campaignName,
      utm_campaign: `${data.campaignName}|${data.campaignId}`,
      utm_medium: `${data.adsetName}|${data.adsetId}`,
      utm_content: data.adName,
      cmc_adid: `fb_${data.adId}`,
    }),
    // axios.get(
    //   "https://api.pushcut.io/EOJzw385r_u6-957qImuI/notifications/MinhaNotifica%C3%A7%C3%A3o"
    // ),
  ])

  try {
    const response2 = await axios.post(urlFace, eventData)
    console.log("Evento enviado com sucesso:", response2.data)
    res.status(200).send("Sucesso")
  } catch (error) {
    console.error(
      "Erro ao enviar o evento:",
      error.response ? error.response.data : error.message
    )
    res.status(400).send("Erro send")
  }
})

https.createServer(options, app).listen(443, () => {
  console.log("Server is running on https://servertt.online")
})

// const PORT = 3000
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`)
// })
