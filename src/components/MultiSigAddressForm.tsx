
import React, { useState, useReducer, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode';

export default function MultiSigAddressForm() {

  const defaultPubkeyValues: string[] = ['', ''];

  const [qrcodeUrl, setQRcodeUrl] = useState('');
  const [address, setAddress] = useState('');
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultError, setResultError] = useState(false);
  const [resultErrorMessage, setResultErrorMessage] = useState('');
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
        // console.log(url);
        setQRcodeUrl(url);
      })
      .catch(err => {
        console.error(err);
      })
  }, [address]);

  const generateAddress = () => {
    try {
      const pubkeys = pubkeyValues.map((hex: string) => Buffer.from(hex, 'hex'));
      const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ pubkeys, m: mValue }),
      });

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

      console.warn({ error });

      setAddress('');
      setQRcodeUrl('');
      setResultError(true);
      setResultErrorMessage(`Error found with Pubkey #${(Number(error.__property.replace('pubkeys.', '')) + 1)}`);
      setResultSuccess(false);
      return;
    }

  }

  const clearResults = () => {
    const confirmed = confirm('Clear form values?');
    if (!confirmed) {
      return;
    }

    setMValue(1);
    setNValue(2);
    setPubkeyValues(['', '']);
    setResultError(false);
    setResultSuccess(false);
    setResultErrorMessage('');
    setAddress('');
  }

  const setValues = () => {

    // Sample from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts#L40
    setMValue(2);
    setNValue(3);
    setPubkeyValues([
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ]);

    // Generated address should equal to 36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7
  }

  const renderInupts = () => {

    let result: any;
    pubkeyValues.forEach((input: string) => {
      result += (<div><input type="text" value={input} /></div>);
    });

    return result;
  }

  const setPubkeyValueOnPosition = (position: number, value: string) => {
    const finalPubkeyList = pubkeyValues;
    finalPubkeyList[position] = value;
    setPubkeyValues(finalPubkeyList);
    forceUpdate();
  }

  const generatePubkeyInputFields = () => {
    let index: number = 0;
    const resultInputs: any[] = [];
    while (index < nValue) {
      const _index = Number(index);
      resultInputs.push(<div key={_index} className="input-container input-group mb-3">
                          <span className="input-group-text">Pubkey { _index + 1 }</span>
                          <input type="text" value={ pubkeyValues[_index] } className="form-control"
                          aria-label="pubkey" aria-describedby={ `pubkey${(_index + 1)}` }
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
            <label htmlFor="m-value" className="form-label">Number of signatures required <br/><span className="small">(Value of m)</span></label>
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
            <label htmlFor="n-value" className="form-label">Number of public keys <br/><span className="small">(Value of n)</span></label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="range" className="form-range" min="2" max="15" value={nValue} step="1" id="n-value" onChange={
              (e: React.ChangeEvent<HTMLInputElement>) => {
                const newNValue = Number(e.target.value);

                if (newNValue < nValue) {
                  while (newNValue < pubkeyValues.length) {
                    pubkeyValues.pop();
                  }
                }

                setNValue(newNValue);
                if (mValue > newNValue) {
                  setMValue(newNValue - 1);
                }

                while (newNValue > pubkeyValues.length) {
                  pubkeyValues.push('');
                }

                setResultSuccess(false);
                forceUpdate();
              }
            }/>

            <div>{ nValue }</div>
          </div>
        </div>

        <hr/>

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            Public Keys <br/><span className="small">(Change value of n to add more pubkeys)</span>
          </div>

          <div className="col-12 col-sm-9">
          {
            generatePubkeyInputFields()
          }

          </div>
        </div>

        <hr/>

        <div style={{ float: 'right' }}>
          <input className="btn btn-default" type="button" onClick={setValues} value="Set Sample Values" />
        </div>

        <div>
          <input className="btn btn-primary" type="button" onClick={generateAddress} value="Generate Address" />
          <input className="btn btn-default" type="button" onClick={clearResults} value="Clear Results and Reset Form" />
        </div>

        <hr/>

        {
          resultSuccess && <div className="alert alert-success">
            <h5>The generated Bitcoin Address:</h5>
            <hr/>
            <div className="result-container" style={{ textAlign: 'center' }}>
              <div className="result-qrcode-div">{qrcodeUrl && <img src={ qrcodeUrl } className="qrcode-img" />}</div>
              <div className="result-address">{address}</div>
              <div className="result-address">
                <a href={ `https://www.blockchain.com/btc/address/${address}` } target="blank">View on Blockchain.com</a>
              </div>
            </div>
          </div>
        }

        {
          resultError && <div className="alert alert-danger">
            <h6>Error: Failed to generate Bitcoin Address</h6>
            <div>
              Please make sure the pubkeys are correctly filled. ({resultErrorMessage})
            </div>
          </div>
        }

      </div>

    </div>
  )
}
