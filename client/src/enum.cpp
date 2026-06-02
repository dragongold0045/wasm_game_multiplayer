#include "enum.h"
#include <string>

std::string getTypeEntityName(ENTITIES ID) {
  switch(ID) {
    case ENTITIES::ENTITY: return "ENTITY";
    default: return "UNKNOWN-TYPE";
  }
}

std::string getEntityNameFromId(int id) {
  ENTITIES type = static_cast<ENTITIES>(id);

  switch (type) {
    case ENTITIES::ENTITY:  return "ENTITY";
    default:                return "UNKNOWN-TYPE";
  }
}