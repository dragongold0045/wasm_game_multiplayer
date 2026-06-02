import errorHandling from "./errorhanding";
import initalizeModule from "./bundles/wasm";
import { establishServer, joinRoom, MatchRoom } from "./bundles/server";

window.onload = async () => {
  try {
    // preload wasm
    const canvas = document.getElementById("board") as HTMLCanvasElement;
    const Module = await initalizeModule({
      canvas,
      onRuntimeInitialized: () => {
        console.log("client wasm loaded");
      },
      print: (text: string) => console.log(`[WASM_INFO]: ${text}`),
      printErr: (text: string) => console.error(`[WASM_ERROR]: ${text}`),
    });

    // setup wasm & engine
    Module._setup();

    // connect server
    establishServer();

    // join room
    await joinRoom();

    // WASM engine runner
    Module._resizeWindow(window.innerWidth, window.innerHeight);

    console.log("WASM test output", Module._testOutput());

    window.onresize = () => Module._resizeWindow(window.innerWidth, window.innerHeight);

    canvas.addEventListener('mousemove', e => {          
      Module._setCursorPosition(e.offsetX, e.offsetY);   
    });

    let animateId: number;
    const animate = () => {
      animateId = requestAnimationFrame(animate);
      Module._looping();
      if(!MatchRoom.state) return;
      MatchRoom.state.entities?.forEach((entity, ID) => {
        const result = Module.updatePositionOfEntity(ID, entity.position.x, entity.position.y);
        // console.log(result);
      })
    }
    animate();

    // for debug & test
    // window.Module = Module;
  } catch(error) {
    console.error(error);
    errorHandling(error);
  } finally {
    console.log("client()");
  }
}