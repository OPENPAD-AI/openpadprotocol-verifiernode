export const configuration = () => {
  return require(`${process.cwd()}/src/config/${process.env.NODE_ENV}.json`);
};
