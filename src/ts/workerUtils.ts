export function _workerUrl (workerCode: string): string {
  workerCode = `(() => {${workerCode}})()` // encapsulate IIFE
  const _blob = new Blob([workerCode], { type: 'text/javascript' })
  return window.URL.createObjectURL(_blob)
}

let _useWorkers = false // The following is just to check whether we can use workers
/* eslint-disable no-lone-blocks */
if (!IS_BROWSER) { // Node.js
  try {
    require.resolve('worker_threads')
    _useWorkers = true
  } catch (e) {
    /* istanbul ignore next */
    console.log(`[bigint-crypto-utils] WARNING:
This node version doesn't support worker_threads. You should enable them in order to greatly speedup the generation of big prime numbers.
  · With Node >=11 it is enabled by default (consider upgrading).
  · With Node 10, starting with 10.5.0, you can enable worker_threads at runtime executing node --experimental-worker `)
  }
} else { // Native JS
  if (self.Worker !== undefined) _useWorkers = true
}

export { _useWorkers }

export interface WorkerToMainMsg {
  isPrime: boolean
  value: bigint
  id: number
}

export interface MainToWorkerMsg {
  rnd: bigint
  iterations: number
  id: number
}
