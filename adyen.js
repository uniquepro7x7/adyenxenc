const { createEncryption } = require('node-adyen-encrypt')(25);
const querystring = require('querystring');
const parseData = querystring.parse(process.argv[2] || '');
const card = parseData.card.split(',');
const needle = card[5];
key = needle.replace("/", '|');

const encode_adyen = (data) => {
  const adyenKey = key;
  const options = {};
  const cseInstance = createEncryption(adyenKey, options);
  data.generationtime = new Date().toISOString();
  return cseInstance.encrypt(data);
};

const encryptedCard = {
  paymentMethod: {
    type: 'scheme',
    encryptedCardNumber: encode_adyen({ number: card[0] }),
    encryptedExpiryMonth: encode_adyen({ expiryMonth: card[1] }),
    encryptedExpiryYear: encode_adyen({ expiryYear: card[2] }),
    encryptedSecurityCode: encode_adyen({ cvc: card[3] }),
    encryptedBin: encode_adyen({ bin: card[4] }),
  },
};

console.log(JSON.stringify(encryptedCard));
