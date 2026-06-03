#ifndef ZOMBIE_H
#define ZOMBIE_H

#include "../Entity.h"

class Zombie : public Entity {
  public:
    Zombie(Vector position);

    void render(val ctx) override;
};

#endif