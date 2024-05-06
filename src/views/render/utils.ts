export function generateId(n = 12) {
  const letters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result = "";
  for (var i = 0; i < n; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}
