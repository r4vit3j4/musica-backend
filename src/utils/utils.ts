export const randomNumber = (max: number, avoid?: number) => {
  if (avoid) {
    let rand = Math.floor(Math.random() * max) + 1;
    while (rand === avoid) {
      rand = Math.floor(Math.random() * max) + 1;
    }
    return rand;
  } else {
    return Math.floor(Math.random() * max) + 1;
  }
};
