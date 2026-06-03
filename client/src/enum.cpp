#include "enum.h"
#include <string>

std::string getTypeEntityName(ENTITIES ID) {
  switch(ID) {
    case ENTITIES::ENTITY:  return "ENTITY";
    case ENTITIES::ZOMBIE:  return "ZOMBIE";
    default:                return "ENTITY";
  }
}

std::string getEntityNameFromId(int id) {
  ENTITIES type = static_cast<ENTITIES>(id);

  return getTypeEntityName(type);
}