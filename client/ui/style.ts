export type Style = {
  base?: (string: string) => string;
  focused?: (string: string) => string;
  hovered?: (string: string) => string;
  disabled?: (string: string) => string;
};
