#ifndef PARTICLE_H
#define PARTICLE_H

#include <string>
#include <iostream>
#include "../Vector.h"
#include "emscripten/val.h"
#include <cmath>

using emscripten::val;

using namespace std;

class Particle {
  public:
    Vector position;

    int ID;

    float size;
    float alpha = 1.0f;

    int outerSpeed = 40; // must be int

    float friction = 0.01f;

    Particle();

    Particle(Vector position);

    virtual void init();

    virtual float generateSize();

    virtual ~Particle() = default;

    virtual void tick(float delta);

    virtual void render(val ctx);

    Vector velocity = Vector(0, 0);
};

#endif