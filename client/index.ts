import errorHandling from "./errorhanding";
import initalizeModule from "./bundles/wasm";
import { establishServer, joinRoom, MatchRoom } from "./bundles/server";
import inputs from "./bundles/inputs";
import Fontfaces from "./bundles/Fontfaces";

window.onload = async () => {
  try {
    await Promise.all(Fontfaces.map((fontface) => new Promise(async (resolve, reject) => {
      const font = await fontface.load();
      document.fonts.add(font);
      resolve(font);
    })))
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

    ["keydown", "keyup"].forEach((event: "keydown" | "keyup") => {
    canvas.addEventListener(event, (ev) => {
      switch(ev.key.toLowerCase()) {
        case "w":case"arrowup":
          inputs.MOVEMENT.UP = event === "keydown";
          break;
        case "a":case"arrowleft":
          inputs.MOVEMENT.LEFT = event === "keydown";
          break;
        case "s":case"arrowdown":
          inputs.MOVEMENT.DOWN = event === "keydown";
          break;
        case "d":case"arrowright":
          inputs.MOVEMENT.RIGHT = event === "keydown";
          break;
        default:
          inputs.KEYBOARD.set(ev.key.toLowerCase(), event === "keydown");
          break;
      }
      // ev.preventDefault(); // Prevent default tab behavior
    });
  })

    let animateId: number;
    const animate = () => {
      animateId = requestAnimationFrame(animate);
      if(MatchRoom.state) MatchRoom.state.entities?.forEach((entity, ID) => {
        const result = Module.updatePositionOfEntity(ID, entity.position.x, entity.position.y);
      });
      Module._looping();
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