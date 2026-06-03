#ifndef CAMERA_H
#define CAMERA_H

#include "Vector.h"

inline const int Z_DEFAULT_VIEW = 1500;

class Camera {
  public:
    Vector position = Vector(0, 0);
    struct viewport {
      float width = 500, height = 500, zView = Z_DEFAULT_VIEW;
      float scale[2] = { 1.0f , 1.0f };
    } viewport;

    float BASE_WIDTH, BASE_HEIGHT;

    Camera();

    void moveTo(float x, float y);

    void zoomTo(float z);

    void updateViewport();
};

#endif