#ifndef VECTOR_H
#define VECTOR_H

class Vector {
public:
  float x = 0.0f;
  float y = 0.0f;

  Vector(); 
  Vector(float dx, float dy);

  Vector clone();
  Vector add(Vector v);
  Vector sub(Vector v);
  Vector multi(float scale);
  Vector divide(float scale);
};

Vector Lerp(const Vector& start, const Vector& end, float t);

#endif