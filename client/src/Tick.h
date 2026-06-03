#ifndef TICK_H
#define TICK_H

#include <unordered_map>
#include <cmath>
#include <string>
#include "Vector.h"
#include "Entity.h"
#include "enum.h"
#include "Camera.h"
#include <memory>

using namespace std;

inline unordered_map<string, shared_ptr<Entity>> entities;

inline Camera camera;

struct XYOption {
  float x, y;
};

struct createOptions {
  string ID;
  int TYPE;
  float size, angle;
  XYOption position;
};

void addNewEntity(createOptions options);

void removeEntity(string ID);

void Ticker(val ctx);

bool updatePositionOfEntity(string ID, float x, float y);

void setControl(string ID);

#endif