
import React, { useState, useReducer, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode';

export default function HDSegwitAddressForm() {

  const [qrcodeUrl, setQRcodeUrl] = useState('');
  const [seed, setSeed] = useState('');
  const [path, setPath] = useState('');
  const [address, setAddress] = useState('');
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultError, setResultError] = useState(false);
  const [resultErrorMessage, setResultErrorMessage] = useState('');

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
      const bitcoinNetwork = bitcoin.networks.bitcoin;
      const hdMaster = bitcoin.bip32.fromSeed(Buffer.from(seed, 'hex'), bitcoinNetwork)

      const userKey = hdMaster.derivePath(path);

      const userKeyPair = bitcoin.ECPair.fromWIF(
        userKey.toWIF()
      );
      const { address } = bitcoin.payments.p2wpkh({ pubkey: userKeyPair.publicKey });

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
      setResultErrorMessage(error.toString());
      setResultSuccess(false);
      return;
    }

  }

  const clearResults = () => {
    const confirmed = confirm('Clear form values?');
    if (!confirmed) {
      return;
    }

    setSeed('');
    setPath('');
    setResultError(false);
    setResultSuccess(false);
    setResultErrorMessage('');
    setAddress('');
  }

  const setValues = () => {

    setSeed('5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4');
    setPath('m/0/0');

    // Generated address should equal to bc1qrh98qvlnec9k9au5auntfj3y2tmmw9w0353lqd
  }

  return (
    <div className="form">

      <div className="container input-container">

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            <label htmlFor="seed" className="form-label">Seed</label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="text" className="form-control" value={seed}
                id="seed" onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setSeed(e.target.value)
                }
              />
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-12 col-sm-3">
            <label htmlFor="path" className="form-label">Path</label>
          </div>

          <div className="col-12 col-sm-9">
            <input type="text" className="form-control" value={path} placeholder="BIP32 compatible paths e.g. m/0/0"
                id="path" onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)
                }
              />
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
              <div className="result-qrcode-div">{ qrcodeUrl && <img src={ qrcodeUrl } className="qrcode-img" /> }</div>
              <div className="result-address">{ address }</div>
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
              Please make sure the inputs are correctly filled. ({resultErrorMessage})
            </div>
          </div>
        }

      </div>
    </div>

  )
}
