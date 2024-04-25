export const classNames = (...classes: (string | undefined | false)[]) =>
  classes.filter((cls) => !!cls).join(' ');
