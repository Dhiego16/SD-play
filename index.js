const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CONFIGURA AQUI:
// URL da API do Baiyles pra mandar mensagem (muda pra real)
const BAIYLES_API_URL = 'https://api.baiyles.com/sendMessage'; 
// Sua chave da API do Baiyles
const BAIYLES_API_KEY = 'SUA_CHAVE_AQUI';

// Função que manda mensagem no Baiyles via API
async function enviarMensagemBaiyles(phone, message) {
  try {
    await axios.post(BAIYLES_API_URL, {
      phone,
      message,
    }, {
      headers: {
        Authorization: `Bearer ${BAIYLES_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Mensagem enviada pro Baiyles:', phone);
  } catch (err) {
    console.error('Erro ao enviar mensagem Baiyles:', err.message);
  }
}

// Endpoint que recebe o webhook Mercado Pago
app.post('/mercadopago-webhook', async (req, res) => {
  const payment = req.body;

  // Ajusta conforme o formato do webhook real do Mercado Pago
  if (payment.type === 'payment' && payment.data.status === 'approved') {
    // Pega número do pagador (se não tiver, coloca um padrão)
    const phone = payment.data.payer?.phone?.number || '+5562998577568';
    const amount = payment.data.transaction_amount;
    const message = `Pagamento aprovado! Valor: R$${amount}. Acesso liberado na SD PLAY. Qualquer dúvida, só chamar!`;

    await enviarMensagemBaiyles(phone, message);

    return res.status(200).send('OK');
  }
  
  res.status(200).send('Evento ignorado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
