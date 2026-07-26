/**
 * Idea is based on Daggerheart's implementation. Supposedly this is
 * the common method of bypassing data protection - normally
 * players cannot change the values for documents they do not own.
 *
 * Its gonna be heavily used for automation and other stuff.
 * todo: finish this module
 */

/* ---------------------------------- */
/*             Definitions            */
/* ---------------------------------- */

/**
 * Signal to refresh rendered application sheet.
 */
export const RefreshType = {
  groupSheet: "DGNSGroupSheetRefresh",
};

/**
 * * Main method for managing socket events.
 * @param {*} param0 socket event
 */
export function handleSocketEvent({ action = null, data = {} } = {}) {
  switch (action) {
  }
}

/**
 *
 */
export const registerSocketHooks = () => {};
