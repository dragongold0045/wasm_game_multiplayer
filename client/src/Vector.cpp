#include "Vector.h"

Vector::Vector() : x(0.0f), y(0.0f) {}

Vector::Vector(float dx, float dy) {
  this->x = dx;
  this->y = dy;
}

Vector Vector::clone() {
  return Vector(this->x, this->y);
}

Vector Vector::add(Vector v) {
  return Vector(this->x + v.x, this->y + v.y);
}

Vector Vector::sub(Vector v) {
  return Vector(this->x - v.x, this->y - v.y);
}

Vector Vector::multi(float scale) {
  return Vector(this->x * scale, this->y * scale);
}

Vector Vector::divide(float scale) {
  return Vector(this->x / scale, this->y / scale);
}

Vector Lerp(const Vector& start, const Vector& end, float t) {
  if (t < 0.0f) t = 0.0f;
  if (t > 1.0f) t = 1.0f;

  float newX = start.x + t * (end.x - start.x);
  float newY = start.y + t * (end.y - start.y);
  return Vector(newX, newY);
}