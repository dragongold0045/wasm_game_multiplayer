#include "Camera.h"

Camera::Camera(): BASE_WIDTH(500) , BASE_HEIGHT(500) {};

void Camera::moveTo(float x, float y) {
  // this->position.x = x;
  // this->position.y = y;
  if(position.x == 0) position.x = x;
  else position.x = linear(position.x, x, 0.3f);
  if(position.y == 0) position.y = y;
  else position.y = linear(position.y, y, 0.3f);
  this->updateViewport();
};

void Camera::zoomTo(float z) {
  this->viewport.zView = z;
  this->updateViewport();
}

void Camera::updateViewport() {
  float scale = this->viewport.zView / Z_DEFAULT_VIEW;

  this->viewport.width = this->BASE_WIDTH * scale;
  this->viewport.height = this->BASE_HEIGHT * scale;
  viewport.scale[0] = viewport.scale[1] = scale;
};