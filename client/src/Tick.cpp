#include "Tick.h"
#include "iostream"
#include "enum.h"
#include <emscripten/bind.h>
#include <chrono>

#include "./effects/particlemaker.h"
#include "EntitiesList.h"

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

    case ENTITIES::AUTOTURRET:
      result = make_shared<AutoTurret>(startPos);
      break;
        
    case ENTITIES::ENTITY:
    default:
      result = make_shared<Entity>(startPos);
      break;
  }

  result->ID = options.ID;
  result->physics.size = options.size;
  result->physics.angle = options.angle;

  result->init();

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

bool updatePhysicsOfEntity(string ID, float size, float angle) {
  try {
    auto& entity = entities.at(ID);
    entity->physics.size = size;
    entity->physics.angle = angle;
    return true;
  } catch (const std::out_of_range& e) {
    return false;
  }
}

EMSCRIPTEN_BINDINGS(update_entity) {
  emscripten::function("updatePhysicsOfEntity", &updatePhysicsOfEntity);
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

auto last_time = std::chrono::steady_clock::now();

// TODO: fix camera viewport show/hide object

void Ticker(val ctx) {
  auto current_time = std::chrono::steady_clock::now();
  std::chrono::duration<float> elapsed = current_time - last_time;
  float delta_time = elapsed.count();
  last_time = current_time;

  particlesToRemove.clear();

  const int points = 3;
  const float range = 400;

  for(float angle = 0; angle < M_PI*2; angle += M_PI*2 / points) {
    Vector position(
      std::cos(angle) * range,
      std::sin(angle) * range
    );

    createParticle(0, position, 10);
  };

  for(auto &[id, particle] : particles) {
    float hitsizeCamera = particle->size * 2;
    if(
      particle->position.x + hitsizeCamera < camera.position.x - camera.viewport.width / 2 ||
      particle->position.y + hitsizeCamera < camera.position.y - camera.viewport.height / 2 ||
      particle->position.x - hitsizeCamera > camera.position.x + camera.viewport.width / 2 ||
      particle->position.y - hitsizeCamera > camera.position.y + camera.viewport.height / 2
    ) {
      particlesToRemove.push_back(id);
      continue;
    }

    particle->tick(delta_time);

    if(particle->alpha <= 0) continue;
    particle->render(ctx);
  }

  for (const auto& id : particlesToRemove) {
    removeParticle(id);
  }

  for(auto &[id, entity] : entities) {
    if(id == controllerID) {
      camera.moveTo(entity->position.x, entity->position.y);
    }

    float hitsizeCamera = entity->physics.size * 2; 

    if(
      entity->position.x + hitsizeCamera < camera.position.x - camera.viewport.width / 2 ||
      entity->position.y + hitsizeCamera < camera.position.y - camera.viewport.height / 2 ||
      entity->position.x - hitsizeCamera > camera.position.x + camera.viewport.width / 2 ||
      entity->position.y - hitsizeCamera > camera.position.y + camera.viewport.height / 2
    ) continue;

    entity->tick(delta_time);
    entity->render(ctx);

    if(entity->visibleName) {
      ctx.call<void>("save");
      ctx.call<void>("translate", entity->position.x, entity->position.y);
      ctx.set("font", "bold 30px Ubuntu-B");
      ctx.set("textAlign", "center");
      ctx.set("fillStyle", "#ffffff");
      ctx.call<void>("fillText", entity->relations.name.value, 0, -entity->physics.size - entity->offsetName);
      ctx.set("strokeStyle", "#333333");
      ctx.set("lineWidth", 1);
      ctx.call<void>("strokeText", entity->relations.name.value, 0, -entity->physics.size - entity->offsetName);
      ctx.call<void>("restore");
    }
  };
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