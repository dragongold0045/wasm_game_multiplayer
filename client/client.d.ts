declare type WASM_FILE_OPTIONS = {
  HEAP8?: Int8Array,
  HEAP16?: Int16Array,
  HEAPU8?: Uint8Array,
  HEAPU16?: Uint16Array,
  HEAP32?: Int32Array,
  HEAPU32?: Uint32Array,
  HEAPF32?: Float32Array,
  HEAPF64?: Float64Array,
  HEAP64?: BigInt64Array,
  HEAPU64?: BigUint64Array,
  memory?: ArrayBuffer,
  allocateUTF8?: (str: string) => number,
  stringToUTF8?: (str: string, buffer: number, bufferSize: number) => void,
  UTF8ToString?: (pointer: number, maxBytesToRead?: number) => string,
  lengthBytesUTF8?: (str: string) => number,
  _free?: (pointer: number) => void,
  [key: string]: <T extends any, P extends any[] = []>(...argument: P) => T;
  // [T: `_${string}`]: <T extends any, P extends any[] = []>(...argument: P) => T;
};

declare module "*.js" {
  async function createWasm<T extends { [key: string]: any }>(moduleArgs: T): Promise<WASM_FILE_OPTIONS>;

  export default createWasm;
}