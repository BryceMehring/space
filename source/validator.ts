const offscreenCanvasErrorMessage = 'OffscreenCanvas is not supported';

export const validateWebGL = (): string | null => {
  const canvas = document.createElement('canvas');

  if (!canvas.transferControlToOffscreen) {
    return offscreenCanvasErrorMessage;
  }

  try {
    canvas.transferControlToOffscreen();
  } catch(e) {
    return offscreenCanvasErrorMessage;
  }

  return null;
};
