'use strict';

//const window = self;

importScripts('./bigint-utils-latest.browser.js'); // to be replaced during build with rollup replace

onmessage = async function(event) { // Let's start once we are called
    // event.data = {rnd: <bigint>, iterations: <number>}
    const isPrime = await bigintUtils.isProbablyPrime(event.data.rnd, event.data.iterations);
    postMessage({
        'isPrime': isPrime,
        'value' : event.data.rnd
    });
};