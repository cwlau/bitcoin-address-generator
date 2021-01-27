
// import * as React from 'react';
import React, { useState, useReducer } from 'react';
import * as bitcoin from 'bitcoinjs-lib';

export default function MultiSigAddressForm() {

  const defaultPubkeyValues: string[] = ['', ''];

  const [result, setResult] = useState({address: ''});
  const [resultError, setResultError] = useState(false);
  const [mValue, setMValue] = useState(1);
  const [nValue, setNValue] = useState(2);
  const [pubkeyValues, setPubkeyValues] = useState(defaultPubkeyValues);

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

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

    console.log('generateAddress done');
    console.log({ address });

    if (!address) {
      setResult({ address: '' });
      setResultError(true);
      return;
    }

    setResultError(false);
    setResult({ address });
  }

  const clearResults = function() {
    setMValue(1);
    setNValue(2);
    setPubkeyValues(['', '']);
    setResult({address: ''});
  }

  const setValues = function() {

    setMValue(3);
    setNValue(4);
    setPubkeyValues([
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ]);

    // console.log('setValues done');
  }

  const renderInupts = function() {

    let result: any;
    pubkeyValues.forEach((input: string) => {
      result += (<div><input type="text" value={input} /></div>);
    });

    return result;
  }

  const setPubkeyValueOnPosition = function(position: number, value: string) {
    let finalPubkeyList = pubkeyValues;
    finalPubkeyList[position] = value;
    setPubkeyValues(finalPubkeyList);
    forceUpdate();
  }

  const generatePubkeyInputFields = function() {
    let index: number = 0;
    let resultInputs: any[] = [];
    while (index < nValue) {
      let _index = Number(index);
      resultInputs.push(<div key={_index} className="pubkeys-input-container">
                          <input type="text" value={pubkeyValues[_index]} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                              return setPubkeyValueOnPosition(_index, e.target.value)
                            }
                          } />
                        </div>);
      index += 1;
    }
    return resultInputs;
  }

  return (
    <div className="form">

      <div className="container">

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            <label htmlFor="m-value" className="form-label">Value of m</label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="range" className="form-range"
                min="1" max={nValue} value={mValue} step="1"
                id="m-value" onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setMValue(Number(e.target.value))
                }
              />

            <div>{ mValue }</div>
          </div>
        </div>

        <hr/>

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            <label htmlFor="n-value" className="form-label">Value of n</label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="range" className="form-range" min="2" max="10" value={nValue} step="1" id="n-value" onChange={
              (e: React.ChangeEvent<HTMLInputElement>) => {
                const newNValue = Number(e.target.value);
                setNValue(newNValue);
                if (mValue > newNValue) {
                  setMValue(newNValue - 1);
                }

                while (nValue >= pubkeyValues.length) {
                  pubkeyValues.push('');
                }
                forceUpdate();
              }
            }/>

            <div>{ nValue }</div>
          </div>
        </div>

        <hr/>

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            Pubkeys
          </div>

          <div className="col-12 col-sm-9">
          {
            generatePubkeyInputFields()
          }

          </div>
        </div>

      </div>

      <hr/>

      <input className="btn btn-default" type="button" onClick={setValues} value="Set Value" />
      <input className="btn btn-primary" type="button" onClick={generateAddress} value="Generate Address" />
      <input className="btn btn-default" type="button" onClick={clearResults} value="Clear Results and Reset Form" />
    </div>
  )
}
