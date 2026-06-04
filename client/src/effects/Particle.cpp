#include "Particle.h"
#include "../tools/rdn.h"
#include "particlemaker.h"

Particle::Particle(): position(Vector(0, 0)) , ID(TOTAL_PARTICLE_ID) , size(getRandomNumber(10, 60)/10) , alpha(1) {}
Particle::Particle(
  Vector position
): position(position) , ID(TOTAL_PARTICLE_ID) {}

float Particle::generateSize() {
  return getRandomNumber(10, 60)/10;
};

void Particle::init() {}

void Particle::tick(float delta) {
  if(alpha < 0) {
    particlesToRemove.push_back(ID);
    return;
  }
  position = position.add(velocity.multi(delta));
  velocity = velocity.multi(1 - friction);

  alpha -= 0.01;
};

void Particle::render(val ctx) {
  ctx.call<void>("save");
  ctx.set("globalAlpha", alpha);
  ctx.call<void>("beginPath");
  ctx.call<void>("arc", position.x, position.y, size, 0, M_PI*2,false);
  ctx.set("fillStyle", "#ffffff");
  ctx.call<void>("fill");
  ctx.call<void>("closePath");
  ctx.call<void>("restore");
};