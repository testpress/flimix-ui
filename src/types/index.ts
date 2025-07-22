import React from 'react';

export interface WidgetData {
  id: string;
  type: string;
  attributes: Record<string, any>;
  children?: WidgetData[];
}

export interface PageLayout {
  type: 'page';
  children: WidgetData[];
}

export interface WidgetDefinition {
  type: string;
  name: string;
  icon?: string;
  defaultAttributes: Record<string, any>;
}

export interface WidgetModule {
  getType(): string;
  render(props: WidgetProps): React.ReactElement;
}

export interface WidgetProps {
  attributes: any;
  children?: React.ReactElement[];
} 