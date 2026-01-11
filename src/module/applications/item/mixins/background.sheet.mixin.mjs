/**
 * Mixin obsługujący dynamiczne tło arkusza dla systemu Degenesis.
 * @param {Function} Base - Klasa bazowa (np. ItemSheetV2)
 */
export default function BackgroundSheetMixin(Base) {
  return class extends Base {
    static DEFAULT_OPTIONS = {
      actions: {
        changeSheetBackground: this._onChangeSheetBackground,
        clearSheetBackground: this._onClearSheetBackground,
      },
      window: {
        controls: [
          {
            action: "changeSheetBackground",
            icon: "fa-solid fa-user-circle",
            label: "SHEET.ChangeBackground",
            ownership: "OWNER",
          },
          {
            action: "clearSheetBackground",
            icon: "fa-solid fa-user-circle",
            label: "SHEET.ClearBackground",
            ownership: "OWNER",
          },
        ],
      },
    };

    static async _onChangeSheetBackground(event, target) {
      const document = this.document;
      const filePicker = new FilePicker({
        type: "image",
        current: document.system.backgroundImage || "",
        callback: async (path) => {
          if (path) {
            try {
              await document.update({
                "system.backgroundImage": path,
              });
              ui.notifications.info(
                game.i18n.format("DGNS.Notifications.BackgroundUpdated", {
                  path,
                })
              );
            } catch (error) {
              console.error("Degenesis | Background Update Error:", error);
              ui.notifications.error("Failed to update background image.");
            }
          }
        },
      });

      return filePicker.browse();
    }

    static async _onClearSheetBackground(event, target) {
      try {
        await this.document.update({
          "system.backgroundImage": null,
        });
      } catch (err) {
        console.error("Degenesis | Background Clear Error:", err);
      }
    }

    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      context.backgroundImage = this.document.system.backgroundImage;

      context.bgStyle = context.backgroundImage
        ? `background-image: url('${context.backgroundImage}');`
        : "";
      return context;
    }
  };
}
