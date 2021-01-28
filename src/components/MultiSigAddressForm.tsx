
// import * as React from 'react';
import React, { useState, useReducer, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode';

export default function MultiSigAddressForm() {

  const defaultPubkeyValues: string[] = ['', ''];

  const [qrcodeUrl, setQRcodeUrl] = useState('');
  const [address, setAddress] = useState('');
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultError, setResultError] = useState(false);
  const [resultErrorMessage, setResultErrorMessage] = useState("");
  const [mValue, setMValue] = useState(1);
  const [nValue, setNValue] = useState(2);
  const [pubkeyValues, setPubkeyValues] = useState(defaultPubkeyValues);

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (address === '') {
      return;
    }

    QRCode.toDataURL(address)
      .then(url => {
        console.log(url);
        setQRcodeUrl(url);
      })
      .catch(err => {
        console.error(err);
      })
  }, [address]);


  const generateAddress = () => {
    // const pubkeys = [
    //   '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    //   '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    //   '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
    //   '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    // ].map(hex => Buffer.from(hex, 'hex'));

    try {
      const pubkeys = pubkeyValues.map((hex: string) => Buffer.from(hex, 'hex'));
      const { address } = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: mValue, pubkeys }),
      });

      // console.log('generateAddress done');
      // console.log({ address });

      if (!address) {
        setAddress('');
        setQRcodeUrl('');
        setResultError(true);
        setResultSuccess(false);
        return;
      }

      setResultError(false);
      setResultSuccess(true);
      setAddress(address);

    } catch (error) {

      console.warn({error});

      setAddress('');
      setQRcodeUrl('');
      setResultError(true);
      setResultSuccess(false);
      return;
    }

  }

  const clearResults = () => {
    setMValue(1);
    setNValue(2);
    setPubkeyValues(['', '']);
    setResultError(false);
    setResultSuccess(false);
    setAddress('');
  }

  const setValues = () => {

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

  const renderInupts = () => {

    let result: any;
    pubkeyValues.forEach((input: string) => {
      result += (<div><input type="text" value={input} /></div>);
    });

    return result;
  }

  const setPubkeyValueOnPosition = (position: number, value: string) => {
    let finalPubkeyList = pubkeyValues;
    finalPubkeyList[position] = value;
    setPubkeyValues(finalPubkeyList);
    forceUpdate();
  }

  const generatePubkeyInputFields = () => {
    let index: number = 0;
    let resultInputs: any[] = [];
    while (index < nValue) {
      let _index = Number(index);
      resultInputs.push(<div key={_index} className="pubkeys-input-container input-group mb-3">
                          <span className="input-group-text">Pubkey { _index + 1 }</span>
                          <input type="text" value={pubkeyValues[_index]} className="form-control"
                          aria-label="pubkey" aria-describedby={"pubkey" + (_index + 1) }
                          onChange={
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
                  // setPubkeyValues([...pubkeyValues, '']);
                }

                // while (pubkeyValues.length - 1 >= nValue) {
                //   // pubkeyValues.pop();
                //   setPubkeyValues(pubkeyValues.slice(0, -1));
                // }

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

        <hr/>

        {
          resultSuccess && <div className="alert alert-success">
            <h5>The generated Bitcoin Address:</h5>
            <hr/>
            <div className="result-container" style={{"textAlign": "center"}}>
              <div className="result-qrcode-div">{qrcodeUrl && <img src={qrcodeUrl} className="qrcode-img" />}</div>
              <div className="result-address">{address}</div>
              <div className="result-address">
                <a href={ "https://www.blockchain.com/btc/address/" + address } target="blank">View on Blockchain.com</a>
              </div>
            </div>
          </div>
        }

        {
          resultError && <div className="alert alert-danger">
            <h6>Error: Failed to generate Bitcoin Address</h6>
            <div>
              Please make sure the pubkeys are correctly filled.
            </div>
          </div>
        }

        <div style={{"float": "right"}}>
          <input className="btn btn-default" type="button" onClick={setValues} value="Set Sample Values" />
        </div>

        <div>
          <input className="btn btn-primary" type="button" onClick={generateAddress} value="Generate Address" />
          <input className="btn btn-default" type="button" onClick={clearResults} value="Clear Results and Reset Form" />
        </div>

      </div>

    </div>
  )
}
