import { getWidgetByType } from './loadWidgets';

export default function WidgetRenderer({ widget }: { widget: any }) {
  const Widget = getWidgetByType(widget.type);
  if (!Widget) return null;

  const children = widget.children?.map((child: any, i: number) => (
    <WidgetRenderer key={i} widget={child} />
  ));

  return Widget.render({ attributes: widget.attributes, children });
}

