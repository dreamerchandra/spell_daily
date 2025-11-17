import { useState, useCallback, useMemo } from 'react';
import type { ColumnConfig } from './ColumnManager';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  sortable?: boolean;
  pinnable?: boolean;
  defaultPinned?: boolean;
  visible?: boolean;
  render?: (row: any) => React.ReactNode;
}

export function useColumnManagement(originalColumns: Column[]) {
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);

  // Update column configurations
  const handleColumnsChange = useCallback((configs: ColumnConfig[]) => {
    setColumnConfigs(configs);
  }, []);

  // Get ordered and filtered columns based on configuration
  const orderedColumns = useMemo(() => {
    if (columnConfigs.length === 0) {
      return originalColumns;
    }

    // Create a map of configurations for quick lookup
    const configMap = new Map(columnConfigs.map(config => [config.id, config]));

    // Filter and sort columns based on configuration
    return originalColumns
      .map(col => {
        const config = configMap.get(String(col.id));
        return {
          ...col,
          order: config?.order ?? 999,
          visible: config?.visible ?? true,
          pinned: config?.pinned ?? false,
        };
      })
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }, [originalColumns, columnConfigs]);

  // Get pinned columns set for styling
  const pinnedColumnsSet = useMemo(() => {
    return new Set(
      columnConfigs
        .filter(config => config.pinned && config.visible)
        .map(config => config.id)
    );
  }, [columnConfigs]);

  return {
    columnConfigs,
    orderedColumns,
    pinnedColumnsSet,
    handleColumnsChange,
  };
}
