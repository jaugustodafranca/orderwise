export const log = (message: string) => {
  const time = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  console.log(`[${time}] Log: ${message}`);
};
