import type { WidgetModule } from './widgets/BaseWidget';

const widgetMap: Record<string, WidgetModule> = {};

export async function loadWidgets(): Promise<void> {
  const modules = import.meta.glob('./widgets/*.tsx');

  for (const path in modules) {
    const mod: any = await modules[path]();
    const widget: WidgetModule = mod.default;

    if (widget && widget.getType) {
      widgetMap[widget.getType()] = widget;
    }
  }
}

export function getWidgetByType(type: string): WidgetModule | undefined {
  return widgetMap[type];
}

