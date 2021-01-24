
// import * as assert from 'assert';
import * as bitcoin from 'bitcoinjs-lib';
import express from "express";

const app = express();
const PORT = 8000;


app.get('/', (req: any, res: any) => {
  if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
  }

  console.log(req.query.m);
  console.log(req.query.pubkeys);

  const pubkeys = [
    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
    '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
  ].map(hex => Buffer.from(hex, 'hex'));
  const { address } = bitcoin.payments.p2wsh({
    redeem: bitcoin.payments.p2ms({ m: 3, pubkeys }),
  });

  console.log({address})

  return res.send('Express + TypeScript Server');
});

app.get('/api/generate', (req: any, res: any) => {
  return res.send("Method not allowed");
});

app.post('/api/generate', (req: any, res: any) => {

  res.set('Access-Control-Allow-Origin', '*');


  return res.send('Express + TypeScript Server')
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
