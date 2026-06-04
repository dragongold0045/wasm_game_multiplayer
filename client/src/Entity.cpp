#include "Entity.h"
#include "Vector.h"
#include <emscripten/bind.h>

Entity::Physics::Physics(): size(0.0f) , angle(0.0f) {};
Entity::Physics::Physics(float size, float angle): size(size) , angle(angle) {};

Entity::Entity(Vector position): position(position) {};
Entity::Entity(
  Vector position,
  Entity::Physics physics,
  Entity::Relations relations,
  Entity::CameraEntity camera,
  std::optional<Inputs> inputs,
  std::optional<Health> health
) : position(position),
    physics(physics),
    relations(relations),
    camera(camera),
    inputs(inputs),
    health(health),
    died(false) 
{

}

void Entity::render(val ctx) {
  ctx.call<void>("beginPath");
  ctx.call<void>("arc", this->position.x, this->position.y, this->physics.size, 0, M_PI * 2, false);
  ctx.set("fillStyle", "#ffffff");
  ctx.call<void>("fill");
  ctx.set("strokeStyle", "#cccccc");
  ctx.call<void>("stroke");
  ctx.call<void>("closePath");
};

void Entity::init() {};

void Entity::updatePosition(Vector v) {
  // position = Lerp(position, v, 0.2f);
  if(position.x == 0) position.x = v.x;
  else position.x = linear(position.x, v.x, 0.2f);
  if(position.y == 0) position.y = v.y;
  else position.y = linear(position.y, v.y, 0.2f);
}

void Entity::tick(float delta) {}

void Entity::setPosition(float x, float y) {
  position.x = x;
  position.y = y;
}

EMSCRIPTEN_BINDINGS(entity) {
  // emscripten::enum_<ENTITIES>("ENTITIES")
  //   .value("ENTITY", ENTITIES::ENTITY);

  emscripten::class_<Entity::Physics>("Physics")
    .constructor<>()
    .property("size", &Entity::Physics::size)
    .property("angle", &Entity::Physics::angle);

  emscripten::class_<Entity::Relations>("Relations")
    .constructor<>()
    .property("rootId", &Entity::Relations::rootId)
    .property("ownerId", &Entity::Relations::ownerId)
    .property("invisible", &Entity::Relations::invisible);

  emscripten::class_<Entity::CameraEntity>("CameraEntity")
    .constructor<>()
    .property("viewZ", &Entity::CameraEntity::viewZ)
    .property("viewport", &Entity::CameraEntity::viewport)
    .property("scaler", &Entity::CameraEntity::scaler);

  emscripten::class_<Inputs>("Inputs")
    .constructor<>()
    .property("speedMovement", &Inputs::speedMovement); 

  emscripten::class_<Health>("Health")
    .constructor<>()
    .property("flag", &Health::flag)
    .property("value", &Health::value)
    .property("max", &Health::max)
    .property("min", &Health::min);

  emscripten::class_<Collide>("Collide")
    .constructor<>()
    .property("enabled", &Collide::enabled)
    .property("knockback", &Collide::knockback);

  emscripten::class_<Entity>("Entity")
    .constructor<>() 
    .constructor<Vector, Entity::Physics, Entity::Relations, Entity::CameraEntity, std::optional<Inputs>, std::optional<Health>>()
    .property("ID", &Entity::ID)
    .property("position", &Entity::position)
    .property("TYPE", &Entity::TYPE)
    .property("physics", &Entity::physics)
    .property("relations", &Entity::relations)
    .property("collide", &Entity::collide)
    .property("camera", &Entity::camera)
    .property("died", &Entity::died)

    .function("hasHealth", +[](const Entity& self) { return self.health.has_value(); })
    .function("getHealth", +[](const Entity& self) { return self.health ? *(self.health) : Health{}; })
    .function("setHealth", +[](Entity& self, Health h) { self.health = h; })

    .function("hasInputs", +[](const Entity& self) { return self.inputs.has_value(); })
    .function("getInputs", +[](const Entity& self) { return self.inputs ? *(self.inputs) : Inputs{}; })
    .function("setInputs", +[](Entity& self, Inputs i) { self.inputs = i; });
}