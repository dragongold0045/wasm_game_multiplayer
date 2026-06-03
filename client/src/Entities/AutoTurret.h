#ifndef AUTOTURRET_H
#define AUTOTURRET_H

#include "../Entity.h"

class AutoTurret : public Entity {
  public:
    AutoTurret(Vector position);

    void render(val ctx) override;

    void tick() override;

    void init() override;
};

#endif