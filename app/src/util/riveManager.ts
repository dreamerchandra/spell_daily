export const footerAnimation = (() => {
  let buffer: ArrayBuffer | undefined = undefined;
  const loadBuffer = async () => {
    return fetch('/rive/footer_animation.riv')
      .then(r => r.arrayBuffer())
      .then(b => {
        buffer = b;
      });
  };
  return {
    getBuffer: () => buffer,
    loadBuffer,
  };
})();
