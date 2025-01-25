export default class Attacker {
  isAllowed() {
    return false;
  }

  toJSON() {
    return {
      kind: "Attacker",
    };
  }
}
