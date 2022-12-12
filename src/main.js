import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#45FF55", "#37C943"],
    americanexpress: ["#C97292", "#8A4E64"],
    discover: ["#EBE03A", "#9C9426"],
    hipercard: ["#7AFCC0", "#52AB82"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//Código de segurança (CVC)
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//Data de expiração
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",

  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMask = IMask(expirationDate, expirationDatePattern)

//Número do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1,5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|50(9[0-9][0-9][0-9])|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|05([7-9])|06([0-9])|07([0-9])|08([0-9])|4([0-3][0-9]|8[5-9]|9[0-9])|5([0-9][0-9]|3[0-8])|9([0-6][0-9]|7[0-8])|7([0-2][0-9])|541|700|720|727|901)|65165([2-9])|6516([6-7][0-9])|65500([0-9])|6550([0-5][0-9])|655021|65505([6-7])|6516([8-9][0-9])|65170([0-4]))/,
      cardType: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{13}$/,
      cardType: "americanexpress",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      cardType: "discover",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^606282|^3841(?:[0|4|6]{1})0/,
      cardType: "hipercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Evento de clique no botão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado.")
})
document.querySelector("form").addEventListener("submit", (event) => {
  //Função que desabilita o evento de recarregamento de página do botão
  event.preventDefault()
})

//Inserção do nome do titular para atualizar no cartão
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value
  if (cardHolder.value.length === 0) {
    ccHolder.innerText = "Fulano da Silva"
  }
})

//Inserção do CVC para atualizar no cartão
securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value
  if (securityCodeMasked.value.length === 0) {
    ccSecurity.innerText = "123"
  }
})

//Inserção do número do cartão de crédito para atualizar no cartão
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)

  const ccNumber = document.querySelector(".cc-info .cc-number")
  ccNumber.innerText = cardNumberMasked.value
  if (cardNumberMasked.value.length === 0) {
    ccNumber.innerText = "1234 5678 9012 3456"
  }
})

//Inserção da data de expiração para atualizar no cartão
expirationDateMask.on("accept", () => {
  const expirationDateCard = document.querySelector(
    ".cc-extra .cc-expiration .value"
  )
  expirationDateCard.innerText = expirationDateMask.value
  if (expirationDateMask.value.length === 0) {
    expirationDateCard.innerText = "12/32"
  }
})
