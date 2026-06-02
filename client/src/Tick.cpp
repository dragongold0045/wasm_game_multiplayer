#include "Tick.h"
#include "iostream"
#include <emscripten/bind.h>

using namespace std;

Entity addNewEntity(createOptions options) {
  cout << "New entity created with ID: " << options.ID << endl;
  Entity result;
  result.ID = options.ID;
  result.physics.size = options.size;
  result.physics.angle = options.angle;
  result.position = Vector(options.position.x, options.position.y);
  entities[options.ID] = result;
  cout << options.ID << " | x-" << to_string(int(result.position.x)) << " y-" << to_string(int(result.position.y)) << endl;
  return result;
}

void removeEntity(string ID) {
  int deletedCount = entities.erase(ID);
  if(deletedCount < 1) cout << "No entity deleted" << endl;
}

bool updatePositionOfEntity(string ID, float x, float y) {
  try {
    Entity& entity = entities.at(ID);
    entity.updatePosition(Vector(x, y));
    return true;
  } catch (const std::out_of_range& e) {
    return false;
  }
}

void Ticker(val ctx) {
  for(auto &[id, entity] : entities) {
    // cout << id << " - x " + to_string(entity.position.x) + " - y " + to_string(entity.position.y) << endl;
    entity.render(ctx);
  }
}

EMSCRIPTEN_BINDINGS(Tick) {
  emscripten::value_object<createOptions>("createOptions")
  .field("size", &createOptions::size)
  .field("angle", &createOptions::angle)
  .field("ID", &createOptions::ID);

  emscripten::value_object<XYOption>("XYOption")
  .field("x", &XYOption::x)
  .field("y", &XYOption::y);

  emscripten::function("addNewEntity", &addNewEntity);
  emscripten::function("removeEntity", &removeEntity);
  emscripten::function("updatePositionOfEntity", &updatePositionOfEntity);
}