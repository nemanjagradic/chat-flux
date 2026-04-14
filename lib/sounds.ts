const messageSound =
  typeof Audio !== "undefined" ? new Audio("/sounds/message.mp3") : null;

export function playMessageSound() {
  if (!messageSound) return;
  messageSound.currentTime = 0;
  messageSound.play().catch(() => {});
}
