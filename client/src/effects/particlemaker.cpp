#include "particlelist.h"
#include "particlemaker.h"
#include "../tools/rdn.h"

#include "cmath"

void createParticle(int ID_TYPE, Vector position, float aroundareasize) {
  PARTICLES TYPE = static_cast<PARTICLES>(ID_TYPE);

  shared_ptr<Particle> particle;

  switch(TYPE) {
    case PARTICLES::Particle:
    default:
      particle = make_shared<Particle>(position);
  };

  float size = particle->generateSize();

  particle->size = size;
  TOTAL_PARTICLE_ID++;
  particle->ID = TOTAL_PARTICLE_ID;

  particle->init();

  float speed = getRandomNumber(int(particle->outerSpeed/2), int(particle->outerSpeed * 1.5));
  float angle = randomAngle();

  particle->position.x += aroundareasize * std::cos(angle);
  particle->position.y += aroundareasize * std::sin(angle);

  Vector velocity(
    std::cos(angle) * speed,
    std::sin(angle) * speed
  );

  particle->velocity = velocity;

  particles[TOTAL_PARTICLE_ID] = particle;
}

void removeParticle(int ID) {
  int deletedCount = particles.erase(ID);
  if(deletedCount < 1) cout << "No particle deleted" << endl;
}