export default class Defender {
  isAllowed() {
    return false;
  }

  toJSON() {
    return {
      role: 'Defender'
    };
  }
}
