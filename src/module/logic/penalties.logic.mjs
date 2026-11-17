export const Penalty = {
  fromTrauma: (traumaValue) => {
    return traumaValue ?? 0;
  },
  fromEncumbrance: (current, max) => {
    return current > max ? current - max : 0;
  },
};
