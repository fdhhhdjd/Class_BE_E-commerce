class TimeUtil {
  static createDateTimeWithOffset(minutes = 15) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}

module.exports = TimeUtil;
