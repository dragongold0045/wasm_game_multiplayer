#include <iostream>
#include <cmath>
#include <vector>
#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include "Entity.h"
#include "Tick.h"

using namespace std;
using emscripten::val;

const int STATUS_CODE = 3667;

thread_local const val document = val::global("document");

string roomId = "NO_ROOM";
string sessionId = "NO_SESSION";

float cursorX = 0.0f;
float cursorY = 0.0f;

val canvas;
val ctx;

// GAME STATE
// float Arenawidth = 500.0f;
// float Arenaheight = 500.0f;
class Arena {
  public:
    float width = 500.0f, height = 500.0f;

    Arena(float dw, float dh) {
      this->width = dw;
      this->height = dh;
    }
};

Arena arena(500.0f, 500.0f);

void handleError(int code, string msg) {
  // handle error from server (code : 1 - 404)
}

struct ArenaOptionOutput {
  float width = arena.width;
  float height = arena.height;

  ArenaOptionOutput() : width(arena.width), height(arena.height) {}

  ArenaOptionOutput(float dw, float dh) {
    this->width = dw;
    this->height = dh;
  }
};

ArenaOptionOutput ArenaOutputData() {
  return ArenaOptionOutput(
    arena.width,
    arena.height
  );
}

EMSCRIPTEN_BINDINGS(client_side) {
  emscripten::function("handleError", &handleError);

  emscripten::value_object<ArenaOptionOutput>("ArenaOptionOutput")
  .field("width", &ArenaOptionOutput::width)
  .field("height", &ArenaOptionOutput::height);
  emscripten::function("currentArenaOptions", &ArenaOutputData);

  // entity maker
  emscripten::enum_<ENTITIES>("ENTITIES")
  .value("ENTITY", ENTITIES::ENTITY);

  emscripten::class_<Vector>("Vector")
  .constructor<float, float>()
  .property("x", &Vector::x)
  .property("y", &Vector::y);
}

extern "C" {
  // TEST output
  EMSCRIPTEN_KEEPALIVE
  int testOutput() {
    cout << STATUS_CODE << " <CODE> " << "running normally" << endl;
    return STATUS_CODE; // output test
  };

  // resize arena
  EMSCRIPTEN_KEEPALIVE
  void setArenaSize(float width, float height) {
    cout << "modified arena" << endl;
    arena.width = width;
    arena.height = height;
  }

  // set & get current room ID
  EMSCRIPTEN_KEEPALIVE
  void setRoomId(const char* id) {
    roomId = string(id);
  }

  EMSCRIPTEN_KEEPALIVE
  const char* getRoomId() {
    return roomId.c_str();
  }

  // set & get current session ID / player ID
  EMSCRIPTEN_KEEPALIVE
  void setSessionId(const char* id) {
    sessionId = string(id);
  }

  EMSCRIPTEN_KEEPALIVE
  const char* getSessionId() {
    return sessionId.c_str();
  }

  // cursor of client controlling
  EMSCRIPTEN_KEEPALIVE
  void setCursorPosition(float x, float y) {
    cursorX = x;
    cursorY = y;
  }
  // running game loop
  EMSCRIPTEN_KEEPALIVE
  void looping() {
    if(canvas.isUndefined() || ctx.isUndefined()) {
      return;
    }

    camera.BASE_WIDTH = canvas["width"].as<int>();
    camera.BASE_HEIGHT = canvas["height"].as<int>();

    camera.updateViewport();

    ctx.call<void>("clearRect", 0, 0, canvas["width"].as<int>(), canvas["height"].as<int>());
  
    ctx.call<void>("save");
    ctx.call<void>("translate", -(camera.position.x - camera.viewport.width / 2), -(camera.position.y - camera.viewport.height / 2));
    ctx.call<void>("scale", camera.viewport.scale[0], camera.viewport.scale[1]);

    // render arena
    ctx.set("fillStyle", "#333");
    ctx.call<void>("fillRect", -arena.width/2, -arena.height/2, arena.width, arena.height);
    
    Ticker(ctx);

    ctx.call<void>("restore");
  }

  // initial setup for canvas and context
  EMSCRIPTEN_KEEPALIVE
  void setup() {
    canvas = document.call<val>("getElementById", val("board"));
    ctx = canvas.call<val>("getContext", val("2d"));

    // set background for canvas
    canvas.set("style", "background: #222;");
    camera.BASE_WIDTH = canvas["width"].as<int>();
    camera.BASE_HEIGHT = canvas["height"].as<int>();
  }

  // resizing the canvas
  EMSCRIPTEN_KEEPALIVE
  void resizeWindow(int width, int height) {
    if(!canvas.isUndefined() && !ctx.isUndefined()) {
      canvas.set("width", width);
      canvas.set("height", height);
    }
  }
}

int main() {
  return 0;
}