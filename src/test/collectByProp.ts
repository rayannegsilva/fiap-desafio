import type { screen } from '@testing-library/react-native';

type Node = NonNullable<typeof screen.root>;

export function collectByProp(
  root: Node | null,
  prop: string,
  value: unknown,
): Node[] {
  if (!root) {
    return [];
  }
  const own = root.props[prop] === value ? [root] : [];
  return own.concat(
    ...root.children.map(child =>
      typeof child === 'string' ? [] : collectByProp(child, prop, value),
    ),
  );
}
