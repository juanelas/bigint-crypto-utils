export declare function _workerUrl(workerCode: string): string;
declare let _useWorkers: boolean;
export { _useWorkers };
export interface WorkerToMainMsg {
    isPrime: boolean;
    value: bigint;
    id: number;
}
export interface MainToWorkerMsg {
    rnd: bigint;
    iterations: number;
    id: number;
}
//# sourceMappingURL=workerUtils.d.ts.map