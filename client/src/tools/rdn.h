#ifndef RDN_H
#define RDN_H

#include "random"

const float PI = std::acos(-1.0f);

static std::random_device rd;
static std::mt19937 gen(rd());

int getRandomNumber(int min, int max);

float randomAngle();

#endif