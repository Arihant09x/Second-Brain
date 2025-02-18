export function random(len: number) {
  let option = "ergrtytbvrtferbvtawercqwe1224356743121";
  let length = option.length;
  let randomString = "";
  for (let i = 0; i < len; i++) {
    randomString += option[Math.floor(Math.random() * length)];
  }
  return randomString;
}
