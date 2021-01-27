
// import * as bitcoin from 'bitcoinjs-lib';
import * as React from 'react';

export default function HDSegwitAddressForm() {

  // const pubkeys = [
  //   '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  //   '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
  //   '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
  //   '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
  // ].map(hex => Buffer.from(hex, 'hex'));
  // const { address } = bitcoin.payments.p2wsh({
  //   redeem: bitcoin.payments.p2ms({ m: 3, pubkeys }),
  // });

  // console.log({address});

  return (
    <div className="app">Hello from HDSegwitAddressForm</div>
  )
}
