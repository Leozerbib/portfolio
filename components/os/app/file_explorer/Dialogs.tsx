'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogsProps } from './types'

export default function Dialogs({
  createDialog,
  renameDialog,
  deleteDialog,
  onCreateItem,
  onRenameItem,
  onDeleteItems,
  onCloseCreateDialog,
  onCloseRenameDialog,
  onCloseDeleteDialog,
  onUpdateCreateDialog,
  onUpdateRenameDialog
}: DialogsProps) {
  
  return (
    <>
      {/* Create Item Dialog */}
      <Dialog open={createDialog.isOpen} onOpenChange={(open) => !open && onCloseCreateDialog()}>
        <DialogContent className='z-[15000]'>
          <DialogHeader>
            <DialogTitle>
              Create New {createDialog.type === 'folder' ? 'Folder' : 'File'}
            </DialogTitle>
            <DialogDescription>
              Enter a name for the new {createDialog.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={`${createDialog.type === 'folder' ? 'Folder' : 'File'} name`}
              value={createDialog.name}
              onChange={(e) => onUpdateCreateDialog({ name: e.target.value, error: undefined })}
              onKeyDown={(e) => e.key === 'Enter' && onCreateItem()}
            />
            {createDialog.error && (
              <p className="text-sm text-destructive">{createDialog.error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCloseCreateDialog}
            >
              Cancel
            </Button>
            <Button onClick={onCreateItem}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Item Dialog */}
      <Dialog open={renameDialog.isOpen} onOpenChange={(open) => !open && onCloseRenameDialog()}>
        <DialogContent className='z-[15000]'>
          <DialogHeader>
            <DialogTitle>Rename {renameDialog.item?.name}</DialogTitle>
            <DialogDescription>
              Enter a new name for {renameDialog.item?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New name"
              value={renameDialog.newName}
              onChange={(e) => onUpdateRenameDialog({ newName: e.target.value, error: undefined })}
              onKeyDown={(e) => e.key === 'Enter' && onRenameItem()}
            />
            {renameDialog.error && (
              <p className="text-sm text-destructive">{renameDialog.error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCloseRenameDialog}
            >
              Cancel
            </Button>
            <Button onClick={onRenameItem}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && onCloseDeleteDialog()}>
        <DialogContent className='z-[15000]'>
          <DialogHeader>
            <DialogTitle>Delete Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialog.items.length} item(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {deleteDialog.items.slice(0, 5).map((item) => (
              <div key={item.id} className="text-sm text-muted-foreground">
                • {item.name}
              </div>
            ))}
            {deleteDialog.items.length > 5 && (
              <div className="text-sm text-muted-foreground">
                ... and {deleteDialog.items.length - 5} more items
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCloseDeleteDialog}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDeleteItems}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}