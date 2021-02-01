
// Fixing issue: Uncaught ReferenceError: Buffer is not defined
(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './style/app.scss';

import HDSegwitAddressForm from './components/HDSegwitAddressForm';
import MultiSigAddressForm from './components/MultiSigAddressForm';

function App() {

  return (
    <div className="container">

      <a href="https://github.com/cwlau/bitcoin-address-generator" target="_blank">
        <img src="https://github.blog/wp-content/uploads/2008/12/forkme_right_orange_ff7600.png?resize=149%2C149" className="fork-me" alt="Fork me on GitHub" />
      </a>

      <h2 className="page-header header">Bitcoin Address Generator</h2>

      <hr/>

      <h4 className="header">Generate a HD SegWit Bitcoin Address</h4>
      <HDSegwitAddressForm />

      <hr/>

      <h4 className="header">Generate a m-of-n Multi-sig P2SH Bitcoin Address</h4>
      <MultiSigAddressForm />

      <hr/>

      <div className="footer">Made by William Lau <a href="https://github.com/cwlau" target="_blank">@cwlau</a> (2021).</div>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('bitcoin-app'),
);
