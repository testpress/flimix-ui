export interface WidgetProps {
  attributes: any;
  children?: JSX.Element[];
}

export interface WidgetModule {
  getType(): string;
  render(props: WidgetProps): JSX.Element;
}

