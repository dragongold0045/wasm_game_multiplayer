#ifndef TICK_H
#define TICK_H

#include <unordered_map>
#include <cmath>
#include <string>
#include "Vector.h"
#include "Entity.h"
#include "enum.h"

using namespace std;

inline unordered_map<string, Entity> entities;

struct XYOption {
  float x, y;
};

struct createOptions {
  string ID;
  float size, angle;
  XYOption position;
};

Entity addNewEntity(createOptions options);

void removeEntity(string ID);

void Ticker(val ctx);

bool updatePositionOfEntity(string ID, float x, float y);

#endif