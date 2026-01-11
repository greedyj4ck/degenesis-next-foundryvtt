import CharacterData from "./character.mjs";
import NPCData from "./npc.mjs";
import FromHellData from "./fromhell.mjs";
import AberrantData from "./aberrant.mjs";
import SleeperData from "./sleeper.mjs";
import MarauderData from "./marauder.mjs";
import GroupData from "./group.mjs";

export { CharacterData, NPCData, FromHellData, AberrantData, GroupData };

export const config = {
  character: CharacterData,
  npc: NPCData,
  fromhell: FromHellData,
  aberrant: AberrantData,
  sleeper: SleeperData,
  marauder: MarauderData,
  group: GroupData,
};
