export type MenuItemView = {
  label: string;
  href: string;
  isCTA?: boolean;
  children?: MenuItemView[];
};
