export interface WidgetData {
  id: string;
  type: string;
  attributes: any;
  children?: WidgetData[];
}

export interface PageData {
  type: 'page';
  children: WidgetData[];
}

export interface DragItem {
  id: string;
  type: string;
  source: 'toolbox' | 'page';
  widgetData?: WidgetData;
}

export interface DropResult {
  droppedId: string;
  targetId: string;
  position: 'before' | 'after' | 'inside';
}

export interface PageBuilderContextType {
  pageData: PageData | null;
  setPageData: (data: PageData) => void;
  selectedWidget: string | null;
  setSelectedWidget: (id: string | null) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  addWidget: (widget: WidgetData, parentId?: string) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetData>) => void;
  moveWidget: (fromId: string, toId: string, position: 'before' | 'after' | 'inside') => void;
}

export interface WidgetTemplate {
  type: string;
  name: string;
  icon: string;
  defaultAttributes: any;
  defaultChildren?: WidgetData[];
} 