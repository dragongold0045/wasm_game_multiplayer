#ifndef ENTITY_H
#define ENTITY_H

#pragma once
#include <string>
#include <optional>
#include <vector>
#include <functional>
#include "Vector.h"
#include "enum.h"
#include <cmath>
#include <emscripten/val.h>
#include "random"

const float PI = std::acos(-1.0f);

static std::random_device rd;
static std::mt19937 gen(rd());

using emscripten::val;

struct Inputs {
  Vector acceleration = Vector(0, 0);
  Vector mouse = Vector(0, 0);
  std::vector<std::string> status;
  float speedMovement = 10;
};

struct Health {
  std::string flag = "visible";
  float value = 100.0f,
  max = 100.0f,
  min = 0.0f;
};

struct Collide {
  bool enabled = true;
  int knockback = 1000;
};

class Entity {
  public:
    struct Physics {
      float size, angle;

      Physics();
      Physics(float size, float angle);
    };

    float offsetName = 10.0f;
    bool visibleName = true;

    virtual void init();

    struct Relations {
      std::string rootId = "NO-ROOT";
      std::string ownerId = "NO-OWNER";

      struct NameEntity {
        std::string value = "unnamed";
      } name;

      struct TeamEntity {
        std::string ID = "NO-ID";
        std::string name = "Default Team";
        std::string color = "#ffffff";
      } team;

      bool invisible = false;
    };

    struct CameraEntity {
      int viewport = 1500, viewZ = 1500, scaler = 30;
    };
    std::string ID = "NO-ID";
    Vector position;

    ENTITIES TYPE = ENTITIES::ENTITY;

    Entity():
      ID("NO-ID"),
      position(0, 0) {
      physics.size = 30.0f;

      std::uniform_real_distribution<float> dis_angle(0.0f, 2.0f * PI);
      physics.angle = dis_angle(gen);
    };
    Entity(Vector position);
    Entity(
      Vector position,
      Physics physics,
      Relations relations,
      CameraEntity camera,
      std::optional<Inputs> inputs,
      std::optional<Health> health
    ); 

    Physics physics;

    Relations relations;

    Collide collide;

    CameraEntity camera;

    std::optional<Inputs> inputs;
    std::optional<Health> health;

    virtual void render(val ctx);

    virtual ~Entity() = default;

    virtual void tick(float delta);

    void updatePosition(Vector v);

    void setPosition(float x, float y);

    bool died = false;
};

#endif