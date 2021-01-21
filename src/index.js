"use strict";
var express = require('express');
var app = express();
var PORT = 8000;
var btcnodejs = require('btcnodejs');
btcnodejs.network.setup('testnet');
var p2pkh = new btcnodejs.P2pkhScript(btcnodejs.Publickey.fromHex("026263992eda6538202047f1514e0f6155a229c3d61b066807664e9ef73d406d95"));
var multisig = new btcnodejs.MultiSigScript([
    2,
    btcnodejs.Publickey.fromHex("02c08786d63f78bd0a6777ffe9c978cf5899756cfc32bfad09a89e211aeb926242"),
    btcnodejs.Publickey.fromHex("033e81519ecf373ea3a5c7e1c051b71a898fb3438c9550e274d980f147eb4d069d"),
    btcnodejs.Publickey.fromHex("036d568125a969dc78b963b494fa7ed5f20ee9c2f2fc2c57f86c5df63089f2ed3a"),
    3
]);
// const ie_script = new btcnodejs.IfElseScript([p2pkh, multisig])
app.get('/', function (req, res) {
    console.log(p2pkh);
    console.log(multisig);
    // console.log(ie_script);
    return res.send('Express + TypeScript Server');
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:" + PORT);
});
