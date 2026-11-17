export const Condition = {
  calculateMaxTrauma: (bodyValue, psycheValue) => {
    return bodyValue + psycheValue;
  },
  calculateMaxFleshwounds: (bodyValue, toughnessValue) => {
    return (bodyValue + toughnessValue) * 2;
  },
  calculateMaxEgo: (attributeValue, skillValue) => {
    return (attributeValue + skillValue) * 2;
  },
  calculateMaxSpore: (psycheValue, skillValue) => {
    return (psycheValue + skillValue) * 2;
  },
  calculateMovement: (bodyValue, athelticsValue) => {
    return bodyValue + athelticsValue;
  },
  calculateMaxEncumbrance: (bodyValue, forceValue) => {
    return bodyValue + forceValue;
  },
};
