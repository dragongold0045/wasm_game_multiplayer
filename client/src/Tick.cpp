#include "Tick.h"
#include "iostream"
#include "enum.h"
#include <emscripten/bind.h>

#include "./Entities/Zombie.h"

using namespace std;

void addNewEntity(createOptions options) {
  cout << "New entity created with ID: " << options.ID << " (Type: " << options.TYPE << ")" << endl;
  
  ENTITIES entityType = static_cast<ENTITIES>(options.TYPE);
  
  shared_ptr<Entity> result;

  Vector startPos(options.position.x, options.position.y);
  switch (entityType) {
    case ENTITIES::ZOMBIE:
      result = make_shared<Zombie>(startPos);
      break;
        
    case ENTITIES::ENTITY:
    default:
      result = make_shared<Entity>(startPos);
      break;
  }

  result->ID = options.ID;
  result->physics.size = options.size;
  result->physics.angle = options.angle;

  entities[options.ID] = result;
}
void removeEntity(string ID) {
  int deletedCount = entities.erase(ID);
  if(deletedCount < 1) cout << "No entity deleted" << endl;
}

bool updatePositionOfEntity(string ID, float x, float y) {
  try {
    auto& entity = entities.at(ID);
    entity->updatePosition(Vector(x, y));
    return true;
  } catch (const std::out_of_range& e) {
    return false;
  }
}

string controllerID = "NO-CONTROL";

void setControl(string ID) {
  controllerID = ID;
  cout << "cID accesssed " << ID << endl;
}

void unsetControl() {
  controllerID = "NO-CONTROL";
}

bool isControl() {
  return controllerID != "NO-CONTROL";
}

void Ticker(val ctx) {
  for(auto &[id, entity] : entities) {
    if(id == controllerID) {
        camera.moveTo(entity->position.x, entity->position.y);
    }

    float hitsizeCamera = entity->physics.size * 2; 

    if(
      entity->position.x - hitsizeCamera < camera.position.x - camera.viewport.width / 2 ||
      entity->position.y - hitsizeCamera < camera.position.y - camera.viewport.height / 2 ||
      entity->position.x + hitsizeCamera > camera.position.x + camera.viewport.width / 2 ||
      entity->position.y + hitsizeCamera > camera.position.y + camera.viewport.height / 2
    ) continue;

    entity->tick();
    entity->render(ctx);

    ctx.call<void>("save");
    ctx.call<void>("translate", entity->position.x, entity->position.y);
    ctx.set("font", "bold 30px Ubuntu-B");
    ctx.set("textAlign", "center");
    ctx.set("fillStyle", "#ffffff");
    ctx.call<void>("fillText", entity->relations.name.value, 0, -entity->physics.size - 10);
    ctx.set("strokeStyle", "#333333");
    ctx.set("lineWidth", 1);
    ctx.call<void>("strokeText", entity->relations.name.value, 0, -entity->physics.size - 10);
    ctx.call<void>("restore");
  }
}

EMSCRIPTEN_BINDINGS(Tick) {
  emscripten::function("setControl", &setControl);

  emscripten::value_object<createOptions>("createOptions")
  .field("size", &createOptions::size)
  .field("angle", &createOptions::angle)
  .field("ID", &createOptions::ID)
  .field("TYPE", &createOptions::TYPE);

  emscripten::value_object<XYOption>("XYOption")
  .field("x", &XYOption::x)
  .field("y", &XYOption::y);

  emscripten::function("addNewEntity", &addNewEntity);
  emscripten::function("removeEntity", &removeEntity);
  emscripten::function("updatePositionOfEntity", &updatePositionOfEntity);
}