#include "AutoTurret.h"
#include "../effects/particlemaker.h"

AutoTurret::AutoTurret(Vector position) : Entity(position) {};

void AutoTurret::init() {
  offsetName = 30.0f;
}

void AutoTurret::render(val ctx) {
  ctx.call<void>("save");
  ctx.call<void>("translate", position.x, position.y);
  // base

  float BASE_SIZE_H = physics.size * 1.5;

  ctx.call<void>("beginPath");
  ctx.call<void>("roundRect", -BASE_SIZE_H, -BASE_SIZE_H, BASE_SIZE_H*2, BASE_SIZE_H*2, BASE_SIZE_H / 4);
  ctx.set("fillStyle", "#3d3d3d");
  ctx.call<void>("fill");
  ctx.set("lineWidth", BASE_SIZE_H / 6);
  ctx.set("strokeStyle", "#2d2d2d");
  ctx.call<void>("stroke");
  ctx.call<void>("closePath");
  
  // turret

  ctx.call<void>("rotate", physics.angle);

  ctx.call<void>("beginPath");
  ctx.call<void>("arc", 0, 0, physics.size, 0, M_PI*2, false);
  ctx.set("fillStyle", "#374b75");
  ctx.call<void>("fill");
  ctx.set("lineWidth", BASE_SIZE_H/6);
  ctx.set("strokeStyle", "#1f2c47");
  ctx.call<void>("stroke");
  ctx.call<void>("closePath");

  ctx.call<void>("beginPath");
  ctx.call<void>("arc", physics.size*0.5, 0, physics.size * 0.5, 0, M_PI*2, false);
  ctx.set("fillStyle", "#374b75");
  ctx.call<void>("fill");
  ctx.set("lineWidth", BASE_SIZE_H/6);
  ctx.set("strokeStyle", "#1f2c47");
  ctx.call<void>("stroke");
  ctx.call<void>("closePath");

  ctx.call<void>("restore");
}

void AutoTurret::tick(float delta) {
  Entity::tick(delta);

  createParticle(0, position.clone(), physics.size);
}