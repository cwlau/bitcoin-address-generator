
// import * as React from 'react';

import React, { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';


export default function MultiSigAddressForm() {

  const defaultPubkeyValues: string[] = [''];

  const [mValue, setMValue] = useState(1);
  const [pubkeyValues, setPubkeyValues] = useState(defaultPubkeyValues);

  // let
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


  const generateAddress = function() {
    // const pubkeys = [
    //   '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    //   '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    //   '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
    //   '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    // ].map(hex => Buffer.from(hex, 'hex'));

    const pubkeys = pubkeyValues.map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2wsh({
      redeem: bitcoin.payments.p2ms({ m: mValue, pubkeys }),
    });

    console.log("generateAddress done");
    console.log({address});
  }

  const setValues = function() {

    setMValue(3);
    setPubkeyValues([
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ]);

    console.log("setValues done");

  }

  const renderInupts = function() {

    let result: any;
    pubkeyValues.forEach((input: string) => {
      result += (<div><input type="text" value={input} /></div>);
    });

    return result;
  }

  return (
    <div className="form">

      <div className="container">

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            <label htmlFor="m-value" className="form-label">Value of m</label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="range" className="form-range" min="1" max={pubkeyValues.length} step="1" id="m-value" />

            <div>{ mValue }</div>
          </div>
        </div>


        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            Pubkeys
          </div>

          <div className="col-12 col-sm-9">
          {
          /*
            pubkeyValues.forEach((input: string) => {
              return (<div><input type="text" value={input} /></div>);
            })
          */
          }


          </div>
        </div>

      </div>


      <input type="button" onClick={setValues} value="Set Value" />
      <input type="button" onClick={generateAddress} value="Generate Address" />
    </div>
  )
}
