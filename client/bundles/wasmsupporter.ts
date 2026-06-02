// reading text from numebr (char*)
export function readText(ptr: number, HEAPU8: Uint8Array) {
  let end = ptr;
  while(HEAPU8[end] !== 0) end++;
  const bytes = HEAPU8.subarray(ptr, end);
  const text = new TextDecoder().decode(bytes);
  return text;
}