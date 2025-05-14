export const generateUID = (): string => {
  // Initial declaration as numbers
  let firstPart: number = (Math.random() * 46656) | 0;
  let secondPart: number = (Math.random() * 46656) | 0;

  // Convert to strings for formatting, but store in new variables
  const firstPartStr: string = ("000" + firstPart.toString(36)).slice(-3);
  const secondPartStr: string = ("000" + secondPart.toString(36)).slice(-3);

  return firstPartStr + secondPartStr;
};
