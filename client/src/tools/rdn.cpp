#include "rdn.h"

int getRandomNumber(int min, int max) {
  std::random_device rd;
  std::mt19937 gen(rd()); 
  std::uniform_int_distribution<> distrib(min, max);
  
  return distrib(gen);
}

float randomAngle() {
  std::random_device rd;
  std::mt19937 gen(rd());
  std::uniform_real_distribution<float> dis_angle(0.0f, 2.0f * PI);
  return dis_angle(gen);
}