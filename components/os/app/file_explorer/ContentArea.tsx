'use client'

import React from 'react'
import { Folder } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ContentAreaProps } from './types'
import FileItem from './FileItem'

export default function ContentArea({
  items,
  selectedItems,
  viewMode,
  searchQuery,
  onItemSelect,
  onItemDoubleClick,
  onItemRename,
  onItemDelete,
  onItemCopy
}: ContentAreaProps) {
  
  return (
    <div className="flex-1">
      <ScrollArea className="h-full">
        <div className={cn(
          "p-4",
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "space-y-1"
        )}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground col-span-full">
              <Folder className="h-12 w-12 mb-4" />
              <p>This folder is empty</p>
              {searchQuery && (
                <p className="text-sm">No items match your search</p>
              )}
            </div>
          ) : (
            items.map((item) => (
              <FileItem
                key={item.id}
                item={item}
                isSelected={selectedItems.has(item.id)}
                viewMode={viewMode}
                onSelect={(isCtrlClick) => onItemSelect(item.id, isCtrlClick)}
                onDoubleClick={() => onItemDoubleClick(item)}
                onRename={() => onItemRename(item)}
                onDelete={() => onItemDelete(item)}
                onCopy={() => onItemCopy(item)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}