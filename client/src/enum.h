#ifndef ENUM_H
#define ENUM_H

#include <string>

enum class ENTITIES : int {
  ENTITY                   = 0,
};

std::string getTypeEntityName(ENTITIES ID);

std::string getEntityNameFromId(int id);

#endif