#ifndef PARTICLEMAKER_H
#define PARTICLEMAKER_H

#include <unordered_map>
#include <memory>
#include <vector>
#include "../Vector.h"
#include "Particle.h"

using namespace std;

inline unordered_map<int, shared_ptr<Particle>> particles;

inline vector<decltype(particles)::key_type> particlesToRemove;

inline int TOTAL_PARTICLE_ID = 0;

enum class PARTICLES : int {
  Particle                                = 0
};

void createParticle(int ID_TYPE, Vector position, float aroundareasize);

void removeParticle(int ID);

#endif