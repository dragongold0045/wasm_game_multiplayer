import createClient from "../src/client.js";

export let Module: WASM_FILE_OPTIONS | null = null;

export default async function initalizeWasm<T extends { [key: string]: any }>(options: T) {
  if(Module) {
    console.warn("WASM already initialized");
    return Module;
  }
  Module = await createClient(options);
  return Module;
}