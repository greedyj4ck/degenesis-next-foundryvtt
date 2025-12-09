const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

/**
 * System related field for storing links to base items that require automation
 * Format: itemType.itemName, eg: cult.pollen
 */
export default class DgnsIdField extends StringField {
  constructor(options = {}) {
    super(options);
  }

  _validateType(value) {
    if (value && !/^[a-z]+\.[a-z0-9_-]+$/i.test(value)) {
      throw new Error(
        `dgnsId must be in format "type.identifier" (got: ${value})`
      );
    }
    return super._validateType(value);
  }

  initialize(value, model, options = {}) {
    const initialized = super.initialize(value, model, options);
    // Return enhanced string with methods
    if (!initialized) return initialized;

    return Object.assign(new String(initialized), {
      // Get type (first part before dot)
      getType() {
        return initialized.split(".")[0] || null;
      },

      // Get identifier (second part after dot)
      getIdentifier() {
        return initialized.split(".")[1] || null;
      },

      // Check if matches type
      isType(type) {
        return this.getType() === type;
      },

      // Get raw value
      toString() {
        return initialized;
      },
    });
  }
}
