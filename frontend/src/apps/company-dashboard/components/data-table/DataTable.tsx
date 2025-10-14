
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Filter,
  Search,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/DropdownMenu';
import { cn } from '@/shared/lib/utils';

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pageSize?: number;
  onRowSelect?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;  // Add row click handler
  bulkActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (selectedRows: T[]) => void;
  }>;
  rowActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (row: T) => void;
  }>;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  pageSize = 10,
  onRowSelect,
  onRowClick,  // Add onRowClick parameter
  bulkActions = [],
  rowActions = [],
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key as keyof T]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [data, globalFilter, columnFilters]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    
    if (onRowSelect) {
      const selectedData = data.filter(row => newSelected.has(row.id));
      onRowSelect(selectedData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(paginatedData.map(row => String(row.id))) : new Set<string>();
    setSelectedRows(newSelected);
    
    if (onRowSelect) {
      const selectedData = checked ? paginatedData : [];
      onRowSelect(selectedData);
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-[#FFFAF3] border-[#63D7C7]/20">
        <div className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-[#E8F5F3] rounded w-1/4"></div>
            <div className="h-10 bg-[#E8F5F3] rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-[#E8F5F3] rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F7368] w-4 h-4" />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-white border-[#63D7C7]/30 text-[#004F4D] placeholder:text-[#1F7368]/60"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3]"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          {selectedRows.size > 0 && bulkActions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#1F7368]">
                {selectedRows.size} selected
              </span>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => action.onClick(data.filter(row => selectedRows.has(row.id)))}
                  className="flex items-center space-x-2 border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3]"
                >
                  {action.icon && <action.icon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Column Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {columns.filter(col => col.filterable).map((column) => (
              <div key={String(column.key)}>
                <label className="text-sm font-medium text-[#1F7368] mb-1 block">
                  {column.header}
                </label>
                <Input
                  placeholder={`Filter ${column.header}...`}
                  value={columnFilters[String(column.key)] || ''}
                  onChange={(e) =>
                    setColumnFilters(prev => ({
                      ...prev,
                      [String(column.key)]: e.target.value,
                    }))
                  }
                  className="bg-white border-[#63D7C7]/30 text-[#004F4D] placeholder:text-[#1F7368]/60"
                />
              </div>
            ))}
          </motion.div>
        )}
      </Card>

      {/* Data Table */}
      <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#63D7C7]/20 hover:bg-[#E8F5F3]">
              {onRowSelect && (
                <TableHead className="w-12 text-[#1F7368]">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-[#63D7C7] text-[#1F7368] focus:ring-[#1F7368]"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "text-[#1F7368] font-semibold",
                    column.sortable && "cursor-pointer hover:bg-[#E8F5F3]",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              {rowActions.length > 0 && (
                <TableHead className="w-12 text-[#1F7368] font-semibold">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={cn(
                  "border-b border-[#63D7C7]/20 hover:bg-[#E8F5F3]",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {onRowSelect && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                      className="rounded border-[#63D7C7] text-[#1F7368] focus:ring-[#1F7368]"
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className="text-[#004F4D]">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key])
                    }
                  </TableCell>
                ))}
                {rowActions.length > 0 && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm" className="text-[#1F7368] hover:bg-[#E8F5F3]">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#FFFAF3] border-[#63D7C7]/20">
                        {rowActions.map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(row)}
                            className="flex items-center space-x-2 text-[#004F4D] hover:bg-[#E8F5F3]"
                          >
                            {action.icon && <action.icon className="w-4 h-4" />}
                            <span>{action.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#63D7C7]/20">
          <div className="text-sm text-[#1F7368]">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3] disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNum = currentPage <= 3 
                  ? index + 1 
                  : currentPage + index - 2;
                  
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={pageNum === currentPage 
                      ? "bg-[#1F7368] hover:bg-[#004F4D] text-white" 
                      : "border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3]"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3] disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#E8F5F3] disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


