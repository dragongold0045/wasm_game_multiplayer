#include "enum.h"
#include <string>

std::string getTypeEntityName(ENTITIES ID) {
  switch(ID) {
    case ENTITIES::ENTITY:default:  return "ENTITY";
    case ENTITIES::ZOMBIE:          return "ZOMBIE";
    case ENTITIES::AUTOTURRET:      return "AUTOTURRET";
  }
}

std::string getEntityNameFromId(int id) {
  ENTITIES type = static_cast<ENTITIES>(id);

  return getTypeEntityName(type);
}