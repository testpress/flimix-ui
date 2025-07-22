import type { ReactNode } from 'react';

export interface WidgetProps {
  attributes: Record<string, any>;
  children?: ReactNode[];
}

export interface WidgetModule {
  getType(): string;
  render(props: WidgetProps): ReactNode;
}

