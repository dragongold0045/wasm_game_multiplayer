#include "Zombie.h"

Zombie::Zombie(Vector position) : Entity(position) {}

void Zombie::render(val ctx) {
  ctx.call<void>("beginPath");
  ctx.call<void>("arc", this->position.x, this->position.y, this->physics.size, 0, M_PI * 2, false);
  ctx.set("fillStyle", "#2daf43");
  ctx.call<void>("fill");
  ctx.set("strokeStyle", "#10490b");
  ctx.call<void>("stroke");
  ctx.call<void>("closePath");
}