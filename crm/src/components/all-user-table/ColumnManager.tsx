import { useState, useEffect, useCallback } from 'react';
import Button from '../Button';
import {
  DragIndicator,
  PushPin,
  PushPinOutlined,
  Settings,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  sortable?: boolean;
  pinnable?: boolean;
  defaultPinned?: boolean;
  visible?: boolean;
}

export interface ColumnConfig {
  id: string;
  label: string;
  order: number;
  pinned: boolean;
  visible: boolean;
}

interface SortableItemProps {
  column: ColumnConfig;
  onTogglePin: (columnId: string) => void;
  onToggleVisibility: (columnId: string) => void;
}

function SortableItem({
  column,
  onTogglePin,
  onToggleVisibility,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center w-full gap-3 p-3 mb-2 rounded-lg border transition-all
        ${
          column.pinned
            ? 'bg-accent-blue bg-opacity-20 border-accent-blue'
            : 'bg-app-secondary border-app-hover'
        }
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
        hover:bg-app-hover
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded cursor-grab text-app-secondary hover:text-app-primary transition-colors"
        title="Drag to reorder"
      >
        <DragIndicator fontSize="small" />
      </button>

      {/* Column Label */}
      <span
        className={`
          flex-1 text-sm
          ${column.visible ? 'text-app-primary' : 'text-app-secondary'}
          ${column.pinned ? 'font-semibold' : 'font-normal'}
        `}
      >
        {column.label}
      </span>

      {/* Pin Toggle */}
      <button
        onClick={() => onTogglePin(column.id)}
        className={`
          p-1 rounded transition-colors
          ${
            column.pinned
              ? 'text-accent-blue hover:text-accent-blue'
              : 'text-app-secondary hover:text-app-primary'
          }
        `}
        title={column.pinned ? 'Unpin column' : 'Pin column'}
      >
        {column.pinned ? (
          <PushPin fontSize="small" />
        ) : (
          <PushPinOutlined fontSize="small" />
        )}
      </button>

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggleVisibility(column.id)}
        className={`
          p-1 rounded transition-colors
          ${
            column.visible
              ? 'text-app-primary hover:text-app-primary'
              : 'text-app-secondary hover:text-app-primary'
          }
        `}
        title={column.visible ? 'Hide column' : 'Show column'}
      >
        {column.visible ? (
          <Visibility fontSize="small" />
        ) : (
          <VisibilityOff fontSize="small" />
        )}
      </button>
    </li>
  );
}

interface ColumnManagerProps {
  columns: Column[];
  onColumnsChange: (configs: ColumnConfig[]) => void;
}

const STORAGE_KEY = 'allUsersTable_columnConfig';

export function ColumnManager({
  columns,
  onColumnsChange,
}: ColumnManagerProps) {
  const [open, setOpen] = useState(false);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const initializeDefaultConfigs = useCallback(() => {
    const defaultConfigs = columns.map((col, index) => ({
      id: String(col.id),
      label: col.label,
      order: index,
      pinned: col.defaultPinned || false,
      visible: true,
    }));
    setColumnConfigs(defaultConfigs);
    onColumnsChange(defaultConfigs);
  }, [columns, onColumnsChange]);

  // Initialize column configs from localStorage or default
  useEffect(() => {
    const savedConfigs = localStorage.getItem(STORAGE_KEY);
    if (savedConfigs) {
      try {
        const parsed = JSON.parse(savedConfigs) as ColumnConfig[];
        // Validate and merge with current columns
        const validConfigs = columns.map((col, index) => {
          const saved = parsed.find(p => p.id === String(col.id));
          return {
            id: String(col.id),
            label: col.label,
            order: saved?.order ?? index,
            pinned: saved?.pinned ?? (col.defaultPinned || false),
            visible: saved?.visible ?? true,
          };
        });
        // Sort by order
        validConfigs.sort((a, b) => a.order - b.order);
        setColumnConfigs(validConfigs);
        onColumnsChange(validConfigs);
      } catch {
        // If parsing fails, use default configs
        initializeDefaultConfigs();
      }
    } else {
      initializeDefaultConfigs();
    }
  }, [columns, onColumnsChange, initializeDefaultConfigs]);

  const saveToLocalStorage = (configs: ColumnConfig[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnConfigs.findIndex(item => item.id === active.id);
      const newIndex = columnConfigs.findIndex(item => item.id === over.id);

      const newConfigs = arrayMove(columnConfigs, oldIndex, newIndex).map(
        (config, index) => ({
          ...config,
          order: index,
        })
      );

      setColumnConfigs(newConfigs);
      onColumnsChange(newConfigs);
      saveToLocalStorage(newConfigs);
    }
  };

  const handleTogglePin = (columnId: string) => {
    const newConfigs = columnConfigs.map(config =>
      config.id === columnId ? { ...config, pinned: !config.pinned } : config
    );
    setColumnConfigs(newConfigs);
    onColumnsChange(newConfigs);
    saveToLocalStorage(newConfigs);
  };

  const handleToggleVisibility = (columnId: string) => {
    const newConfigs = columnConfigs.map(config =>
      config.id === columnId ? { ...config, visible: !config.visible } : config
    );
    setColumnConfigs(newConfigs);
    onColumnsChange(newConfigs);
    saveToLocalStorage(newConfigs);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    initializeDefaultConfigs();
  };

  const pinnedCount = columnConfigs.filter(config => config.pinned).length;
  const visibleCount = columnConfigs.filter(config => config.visible).length;

  return (
    <>
      <Button
        variant="outline"
        icon={<Settings />}
        onClick={() => setOpen(true)}
        size="sm"
        className="text-app-primary border-app-hover hover:border-accent-blue hover:bg-accent-blue hover:bg-opacity-10"
      >
        Manage Columns
      </Button>

      {/* Custom Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-app-secondary border border-app-hover rounded-lg shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-app-hover">
              <h2 className="text-lg font-semibold text-app-primary">
                Manage Table Columns
              </h2>
              <div className="text-sm text-app-secondary">
                {visibleCount} visible • {pinnedCount} pinned
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <p className="text-sm text-app-secondary mb-4">
                Drag to reorder columns. Use pin and visibility controls to
                customize your table.
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={columnConfigs.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-0 max-h-[400px] overflow-y-auto">
                    {columnConfigs.map(config => (
                      <SortableItem
                        key={config.id}
                        column={config}
                        onTogglePin={handleTogglePin}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-app-hover">
              <Button
                variant="text"
                onClick={handleResetToDefault}
                className="text-app-secondary hover:text-app-primary hover:bg-app-hover"
              >
                Reset to Default
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
