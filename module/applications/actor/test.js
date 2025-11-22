// character-sheet.mjs
// Custom Character Sheet using Application V2 API

export class CustomCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: ["custom-character-sheet"],
    position: {
      width: 600,
      height: 800,
    },
    actions: {
      removeCult: this._onRemoveCult,
    },
    window: {
      resizable: true,
    },
  };

  static PARTS = {
    header: {
      template: "systems/your-system/templates/actor/parts/sheet-header.hbs",
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    cult: {
      template: "systems/your-system/templates/actor/parts/cult-section.hbs",
    },
    items: {
      template: "systems/your-system/templates/actor/parts/items-section.hbs",
    },
  };

  tabGroups = {
    sheet: "attributes",
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    // Get the cult item (only one should exist)
    const cultItem = this.actor.items.find((i) => i.type === "cult");

    // Prepare cult data
    context.cult = cultItem
      ? {
          id: cultItem.id,
          name: cultItem.name,
          img: cultItem.img,
          description: cultItem.system.description || "",
          data: cultItem.system,
        }
      : null;

    // Prepare other items
    context.items = this.actor.items
      .filter((i) => i.type !== "cult")
      .map((item) => ({
        id: item.id,
        name: item.name,
        img: item.img,
        type: item.type,
      }));

    // Tabs configuration
    context.tabs = {
      attributes: { id: "attributes", group: "sheet", label: "Attributes" },
      items: { id: "items", group: "sheet", label: "Items" },
    };

    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);

    // Set up drop handler for the actor sheet
    const html = this.element;

    html.addEventListener("drop", (event) => {
      this._onDrop(event);
    });

    html.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
  }

  async _onDrop(event) {
    event.preventDefault();

    // Get the dropped data
    const data = TextEditor.getDragEventData(event);

    if (data.type !== "Item") return;

    // Get the item being dropped
    const item = await Item.implementation.fromDropData(data);

    // Check if it's a cult type item
    if (item.type === "cult") {
      // Check if actor already has a cult item
      const existingCult = this.actor.items.find((i) => i.type === "cult");

      if (existingCult) {
        ui.notifications.warn(
          "This character already belongs to a cult. Remove the existing cult first."
        );
        return false;
      }
    }

    // Allow the default drop behavior for non-cult items or if no cult exists
    return super._onDrop(event);
  }

  static async _onRemoveCult(event, target) {
    const cultId = target.dataset.itemId;

    const confirm = await Dialog.confirm({
      title: "Remove Cult",
      content: "<p>Are you sure you want to remove this cult affiliation?</p>",
      yes: () => true,
      no: () => false,
    });

    if (confirm) {
      await this.actor.deleteEmbeddedDocuments("Item", [cultId]);
      ui.notifications.info("Cult affiliation removed.");
    }
  }
}

// ============================================
// HANDLEBARS TEMPLATE: cult-section.hbs
// ============================================
/*
<div class="cult-section">
  <h2>Cult Affiliation</h2>
  
  {{#if cult}}
    <div class="cult-item" data-item-id="{{cult.id}}">
      <div class="cult-header">
        <img src="{{cult.img}}" alt="{{cult.name}}" class="cult-image" />
        <div class="cult-info">
          <h3>{{cult.name}}</h3>
          <button type="button" data-action="removeCult" data-item-id="{{cult.id}}" class="remove-cult">
            <i class="fas fa-times"></i> Leave Cult
          </button>
        </div>
      </div>
      
      {{#if cult.description}}
        <div class="cult-description">
          {{cult.description}}
        </div>
      {{/if}}
      
      <div class="cult-details">
        <!-- Add any specific cult data fields here -->
        {{#each cult.data as |value key|}}
          <div class="cult-detail">
            <label>{{key}}</label>
            <span>{{value}}</span>
          </div>
        {{/each}}
      </div>
    </div>
  {{else}}
    <div class="no-cult">
      <p>This character does not belong to any cult.</p>
      <p class="hint">Drag a cult item here to join.</p>
    </div>
  {{/if}}
</div>
*/

// ============================================
// CSS STYLING
// ============================================
/*
.cult-section {
  margin: 1rem;
  padding: 1rem;
  border: 2px solid #8b4513;
  border-radius: 8px;
  background: rgba(139, 69, 19, 0.1);
}

.cult-section h2 {
  margin: 0 0 1rem 0;
  color: #8b4513;
  font-size: 1.5rem;
  border-bottom: 2px solid #8b4513;
  padding-bottom: 0.5rem;
}

.cult-item {
  background: white;
  border-radius: 4px;
  padding: 1rem;
}

.cult-header {
  display: flex;
  gap: 1rem;
  align-items: center;  
  margin-bottom: 1rem;
}

.cult-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #8b4513;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.cult-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cult-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.remove-cult {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.remove-cult:hover {
  background: #c82333;
}

.cult-description {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  font-style: italic;
}

.cult-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.cult-detail {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background: rgba(0,0,0,0.03);
  border-radius: 4px;
}

.cult-detail label {
  font-weight: bold;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.no-cult {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-cult .hint {
  font-style: italic;
  font-size: 0.9rem;
  color: #999;
}
*/

// ============================================
// REGISTRATION (in your init hook)
// ============================================
/*
Hooks.once("init", () => {
  // Register the custom sheet
  Actors.registerSheet("your-system", CustomCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Custom Character Sheet"
  });
});
*/
