class RandomUtils {
  static getAvatar = (
    fullname,
    background = "random",
    color = "random",
    size = 256,
    length = 2
  ) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullname
    )}&background=${background}&color=${color}&size=${size}&length=${length}`;
  };

  static generateUsername = (fullName) => {
    const nameParts = fullName.trim().toLowerCase().split(" ");
    const baseUsername = nameParts[nameParts.length - 1] + nameParts[0][0]; // last name + first letter of first name
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
    return `${baseUsername}${randomNumber}`;
  };
}

module.exports = RandomUtils;
