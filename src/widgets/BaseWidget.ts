

export interface WidgetProps {
  attributes: any;
  children?: React.ReactElement[];
}

export interface WidgetModule {
  getType(): string;
  render(props: WidgetProps): React.ReactElement;
}

