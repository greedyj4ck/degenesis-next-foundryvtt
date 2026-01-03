import { DEGENESIS } from "./config.mjs";
import { DEG_Utility } from "./utility.js";

/** Class for creating custom chat messages used by
 * entire application, like rolls, items.
 */
export class DGNSChat {
  //#region Rolls
  //*============================*

  /**
   * Render basic roll // action roll chat message.
   * @param {*} roll Roll object.
   * @param {*} data Object that contains prepared Card Data like template.
   */
  static renderRollCard(roll, data) {
    roll.terms[0].values; // access to dice
  }

  //#endregion

  //#region Card Data
  //*============================*
}

/* 

export class DegenesisChat {
  static renderRollCard(rollResult, cardData) {
    rollResult.rolls.forEach((r) => {
      r.img = `systems/degenesisnext/icons/dice-faces/d${r.result}.svg`;
    });

    if (rollResult.secondaryRolls) {
      rollResult.secondaryRolls.forEach((r) => {
        r.img = `systems/degenesisnext/icons/dice-faces/d${r.result}.svg`;
      });
    }

    rollResult.enResult = rollResult.result; // Original result before translation - used for styling
    rollResult.result = DEGENESIS.rollResults[rollResult.result];

    foundry.utils.mergeObject(cardData, rollResult);

    renderTemplate(cardData.template, cardData).then((html) => {
      let chatData = DEG_Utility.chatDataSetup(html, cardData.speaker); // Passing additional data here
      chatData.speaker = cardData.speaker;
      ChatMessage.create(chatData);
    });
  }
}
 */
