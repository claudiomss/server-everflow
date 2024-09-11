const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const app = express()
const https = require("https")
const fs = require("fs")
const axios = require("axios")

const supabaseUrl = "https://oqyirdgdlowlcifwwfez.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeWlyZGdkbG93bGNpZnd3ZmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDk2MDcsImV4cCI6MjAzNDU4NTYwN30.aU_qhe7Zm_MM9F0TwmlInVGf91-ZOC58e_MG2RBYyeo"
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

app.post("/salvar-ic", cors(), async (req, res) => {
  const data = req.body
  const { _fbc, _fbp, requestNumber, urlCamp } = data

  // try {
  //   const { error } = await supabase.from("wenhook_data_everflow").insert({
  //     fbc: _fbc,
  //     fbp: _fbp,
  //     requestNumber: requestNumber,
  //     urlCamp: urlCamp,
  //   })

  //   if (error) {
  //     console.error("Error inserting data:", error)
  //     return res.status(500).send("Fail")
  //   }

  //   res.status(200).send("Sucesso")
  // } catch (error) {
  //   console.error("Catch block error:", error)
  //   res.status(500).send("Fail")
  // }

  await Promise.allSettled([
    supabase.from("wenhook_data_everflow").insert({
      fbc: _fbc,
      fbp: _fbp,
      requestNumber: requestNumber,
      urlCamp: urlCamp,
    }),
    // axios.get(
    //   "https://api.pushcut.io/EOJzw385r_u6-957qImuI/notifications/MinhaNotifica%C3%A7%C3%A3o"
    // ),
  ])

  // res.status(200).send("Sucesso")
})

// async function sendPurchaseEvent(data, dataDB) {
//   const accessToken =
//     "EAAGyx4TrTyIBO9ZB3iLDoCOrSBupZCOYWtYGNNePgjB2h10EcUCHqzwwlvZADCfPneEwEEBGXkYDdiNVzS5xjnkthrdVnCZAb98vmOWqioOCvqZAFkZAaY57LHhIwLIBk6TcQIvJZCr5ceufZAg1pYBWJlc56GGvw7x1ZBVsZAa75SsAJ3ns4VoImqyUv3w2FdcQZDZD"
//   const pixelId = "1033031881833608"
//   const url = `https://graph.facebook.com/v13.0/${pixelId}/events`

//   const eventData = {
//     data: [
//       {
//         event_name: "Purchase",
//         event_time: Math.floor(Date.now() / 1000),
//         action_source: "website",
//         event_source_url: data.event_source_url,
//         user_data: {
//           client_ip_address: data.client_ip_address,
//           client_user_agent: data.client_user_agent,
//           fbc: data.fbc,
//           fbp: data.fbp,
//           // email: data.email_hash,
//         },
//         custom_data: {
//           currency: "BRL",
//           value: data.value,
//           content_ids: data.content_ids,
//           contents: data.contents,
//           content_type: "product",
//           utm_source: data.campaignName,
//           utm_campaign: `${data.campaignName}|${data.campaignId}`,
//           utm_medium: `${data.adsetName}|${data.adsetId}`,
//           utm_content: data.adName,
//           cmc_adid: `fb_${data.adId}`,
//         },
//       },
//     ],
//     access_token: accessToken,
//   }

//   await Promise.allSettled([
//     supabase.from("vendas_everflow").insert(dataDB),
//     // axios.get(
//     //   "https://api.pushcut.io/EOJzw385r_u6-957qImuI/notifications/MinhaNotifica%C3%A7%C3%A3o"
//     // ),
//   ])

//   try {
//     const response = await axios.post(url, eventData)
//     console.log("Evento enviado com sucesso:", response.data)
//   } catch (error) {
//     console.error(
//       "Erro ao enviar o evento:",
//       error.response ? error.response.data : error.message
//     )
//   }
// }

// async function sendPurchaseEvent2(data) {
//   const accessToken2 =
//     "EAAHqLIBp79EBO7M9JQZCVvi0U6H56pSEY6R3eba6CckuB4Rpl7COpvVUQjk2n4SM2rBkn700upiWMQjzhEnUPfjLbWfqzZBT6gGBlTlRgiNynZAIvBYCGNLtOqzFwkiZACZADs9XZCw2EDOtDxUFbZAIJwiLtuTbnKCq98lm5iNZCKB7m0QFq49p0Czu0z52UZBXq9QZDZD"
//   const pixelId2 = "4636511609906695"

//   const url2 = `https://graph.facebook.com/v13.0/${pixelId2}/events`

//   const eventData2 = {
//     data: [
//       {
//         event_name: "Purchase",
//         event_time: Math.floor(Date.now() / 1000),
//         action_source: "website",
//         event_source_url: data.event_source_url,
//         user_data: {
//           client_ip_address: data.client_ip_address,
//           client_user_agent: data.client_user_agent,
//           fbc: data.fbc,
//           fbp: data.fbp,
//           // email: data.email_hash,
//         },
//         custom_data: {
//           currency: "BRL",
//           value: data.value,
//           content_ids: data.content_ids,
//           contents: data.contents,
//           content_type: "product",
//           utm_source: data.campaignName,
//           utm_campaign: `${data.campaignName}|${data.campaignId}`,
//           utm_medium: `${data.adsetName}|${data.adsetId}`,
//           utm_content: data.adName,
//           cmc_adid: `fb_${data.adId}`,
//         },
//       },
//     ],
//     access_token: accessToken2,
//   }

//   try {
//     const response2 = await axios.post(url2, eventData2)
//     console.log("Evento enviado com sucesso:", response2.data)
//   } catch (error) {
//     console.error(
//       "Erro ao enviar o evento:",
//       error.response ? error.response.data : error.message
//     )
//   }
// }

// // Funções auxiliares para extrair partes dos parâmetros
// function extractCampaignName(campaign) {
//   return campaign.split("|")[0]
// }

// function extractCampaignId(campaign) {
//   return campaign.split("|")[1]
// }

// function extractAdsetName(medium) {
//   return medium.split("|")[0]
// }

// function extractAdsetId(medium) {
//   return medium.split("|")[1]
// }

// function extractAdName(content) {
//   return content.split("|")[0]
// }

// function extractAdId(cmcAdid) {
//   return cmcAdid ? cmcAdid.replace(/^\[|\]$/g, "") : "" // Ajuste conforme necessário
// }

// function covertToReal(valor) {
//   return parseFloat(valor / 100).toFixed(2)
// }

// app.post("/webhook-purchase", async (req, res) => {
//   const reqData = req.body
//   const { statusTransaction, value, requestNumber } = reqData

//   if (statusTransaction == "PAID_OUT") {
//     try {
//       const { error, data } = await supabase
//         .from("wenhook_data")
//         .select("fbc,fbp,urlCamp,client_ip_address,client_user_agent")
//         .eq("requestNumber", requestNumber)
//         .single()

//       console.log(error)
//       console.log(data)

//       const url = await data.urlCamp
//       const urlObj = new URL(url)
//       const urlParams = new URLSearchParams(urlObj.search)

//       const utmSource = urlParams.get("utm_source")
//       const utmCampaign = urlParams.get("utm_campaign")
//       const utmMedium = urlParams.get("utm_medium")
//       const utmContent = urlParams.get("utm_content")
//       const cmcAdid = urlParams.get("xcod") // Utilizando 'xcod' para obter o 'cmc_adid'

//       // Exemplo de dados de evento
//       const eventData = {
//         client_ip_address: data.client_ip_address,
//         client_user_agent: data.client_user_agent,
//         fbc: data.fbc, // Recebendo os cookies via body
//         fbp: data.fbp, // Recebendo os cookies via body
//         event_source_url: url, // Recebendo a URL de origem via body
//         value: value, // Valor da compra
//         content_ids: ["whatspy"], // IDs dos conteúdos comprados
//         contents: [{ id: "whatspy", quantity: 1 }], // Informações sobre os conteúdos comprados
//         campaignName: extractCampaignName(utmCampaign),
//         campaignId: extractCampaignId(utmCampaign),
//         adsetName: extractAdsetName(utmMedium),
//         adsetId: extractAdsetId(utmMedium),
//         adName: extractAdName(utmContent),
//         adId: extractAdId(cmcAdid),
//       }

//       console.log(eventData)

//       const dataDB = {
//         produto: "whatspy",
//         valor: value,
//         campaignName: extractCampaignName(utmCampaign),
//         adsetName: extractAdsetName(utmMedium),
//         adName: extractAdName(utmContent),
//         requestNumber: requestNumber,
//       }

//       await sendPurchaseEvent(eventData, dataDB)

//       return res.status(200).send("Sucesso envio dados")
//     } catch (error) {
//       return res.status(400).send("Fail Envio")
//     }
//   }
//   res.status(500).send("Fail Pay")

//   // Chame a função para enviar o evento ao Facebook Conversion API
//   // console.log(eventData)
// })

// app.post("/everflow-ic", async (req, res) => {
//   const reqData = req.body
//   const { status, total_price, requestNumber } = reqData

//   if (status == "approved") {
//     try {
//       const { error, data } = await supabase
//         .from("wenhook_data")
//         .select("fbc,fbp,urlCamp,client_ip_address,client_user_agent")
//         .eq("requestNumber", requestNumber)
//         .single()

//       console.log(error)
//       console.log(data)

//       const url = await data.urlCamp
//       const urlObj = new URL(url)
//       const urlParams = new URLSearchParams(urlObj.search)

//       const utmSource = urlParams.get("utm_source")
//       const utmCampaign = urlParams.get("utm_campaign")
//       const utmMedium = urlParams.get("utm_medium")
//       const utmContent = urlParams.get("utm_content")
//       const cmcAdid = urlParams.get("xcod") // Utilizando 'xcod' para obter o 'cmc_adid'

//       // Exemplo de dados de evento
//       const eventData = {
//         client_ip_address: data.client_ip_address,
//         client_user_agent: data.client_user_agent,
//         fbc: data.fbc, // Recebendo os cookies via body
//         fbp: data.fbp, // Recebendo os cookies via body
//         event_source_url: url, // Recebendo a URL de origem via body
//         value: covertToReal(total_price), // Valor da compra
//         content_ids: ["whatspy"], // IDs dos conteúdos comprados
//         contents: [{ id: "whatspy", quantity: 1 }], // Informações sobre os conteúdos comprados
//         campaignName: extractCampaignName(utmCampaign),
//         campaignId: extractCampaignId(utmCampaign),
//         adsetName: extractAdsetName(utmMedium),
//         adsetId: extractAdsetId(utmMedium),
//         adName: extractAdName(utmContent),
//         adId: extractAdId(cmcAdid),
//       }

//       console.log(eventData)

//       await sendPurchaseEvent2(eventData)

//       return res.status(200).send("Sucesso envio dados")
//     } catch (error) {
//       return res.status(400).send("Fail Envio")
//     }
//   }
//   res.status(500).send("Fail Pay")
// })

https.createServer(options, app).listen(443, () => {
  console.log("Server is running on https://servertt.online")
})

// const PORT = 3000
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`)
// })
