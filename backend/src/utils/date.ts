export function getNowIST() {
  const now = new Date();

  const istString = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  return new Date(istString);
}
