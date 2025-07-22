import { getWidgetByType } from './loadWidgets';
import type { WidgetData } from './types';

export default function WidgetRenderer({ widget }: { widget: WidgetData }) {
  const Widget = getWidgetByType(widget.type);
  if (!Widget) return null;

  const children = widget.children?.map((child: WidgetData, i: number) => (
    <WidgetRenderer key={i} widget={child} />
  ));

  return Widget.render({ attributes: widget.attributes, children });
}

