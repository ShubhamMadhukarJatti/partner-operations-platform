# Status Pills Feature - Usage Guide

## Overview

The Status Pills feature provides advanced column type with customizable status options, each with their own color. This is perfect for tracking task states, project statuses, or any categorical data.

## Components

### 1. AddColumnMenu Component

Located in: `/components/ui/table/AddColumnMenu.tsx`

**New Features:**

- Added `'status'` to `ColumnType`
- Status Pills submenu with 8 predefined colors
- Hoverable dropdown to select initial status color

**Usage:**

```tsx
import { AddColumnMenu } from '@/components/ui/table/AddColumnMenu'

;<AddColumnMenu
  trigger={<Button>Add Column</Button>}
  onAddColumn={(type, statusColor) => {
    // type: 'text' | 'number' | 'calendar' | 'status'
    // statusColor: optional color ID when type === 'status'
    console.log('Adding column:', type, statusColor)
  }}
  showStatusPills={true} // optional, default: true
/>
```

### 2. StatusPillsManager Component

Located in: `/components/ui/table/StatusPillsManager.tsx`

**Purpose:** Manage status options for a status column (like the image interface)

**Features:**

- ✅ Add new status options
- ✅ Edit status labels
- ✅ Change status colors with color picker
- ✅ Delete status options
- ✅ Clear all statuses

**Usage:**

```tsx
import { StatusPillsManager } from '@/components/ui/table/StatusPillsManager'
import { StatusOption } from '@/components/ui/table/AddColumnMenu'

const [statusOptions, setStatusOptions] = useState<StatusOption[]>([
  { id: '1', label: 'Neutral', color: '#3B82F6' },
  { id: '2', label: 'Status', color: '#10B981' }
])

<StatusPillsManager
  columnId="col-123"
  statusOptions={statusOptions}

  // Handler: Add new status to column
  onAddStatus={(columnId, option) => {
    console.log('Add status:', columnId, option)
    // API call example:
    // await fetch(`/api/columns/${columnId}/statuses`, {
    //   method: 'POST',
    //   body: JSON.stringify(option)
    // })
    setStatusOptions(prev => [...prev, option])
  }}

  // Handler: Delete status option
  onDeleteStatus={(columnId, statusId) => {
    console.log('Delete status:', columnId, statusId)
    // API call example:
    // await fetch(`/api/columns/${columnId}/statuses/${statusId}`, {
    //   method: 'DELETE'
    // })
    setStatusOptions(prev => prev.filter(s => s.id !== statusId))
  }}

  // Handler: Update status (rename or color change)
  onUpdateStatus={(columnId, statusId, updates) => {
    console.log('Update status:', columnId, statusId, updates)
    // API call example:
    // await fetch(`/api/columns/${columnId}/statuses/${statusId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(updates)
    // })
    setStatusOptions(prev =>
      prev.map(s => s.id === statusId ? { ...s, ...updates } : s)
    )
  }}

  // Handler: Clear all statuses
  onClearAll={(columnId) => {
    console.log('Clear all statuses:', columnId)
    // API call example:
    // await fetch(`/api/columns/${columnId}/statuses`, {
    //   method: 'DELETE'
    // })
    setStatusOptions([])
  }}

  onBack={() => console.log('Go back')}
/>
```

## Types & Interfaces

### StatusColor

```typescript
export interface StatusColor {
  id: string // Color identifier (e.g., 'blue', 'green')
  name: string // Display name (e.g., 'Blue', 'Green')
  color: string // Hex color code (e.g., '#3B82F6')
}
```

### StatusOption

```typescript
export interface StatusOption {
  id: string // Unique identifier for this status
  label: string // Display label (e.g., 'In Progress', 'Done')
  color: string // Hex color code
}
```

### StatusColumnHandlers

```typescript
export interface StatusColumnHandlers {
  // Called when adding a new status column with initial options
  onAddStatusColumn?: (initialOptions: StatusOption[]) => void

  // Called when adding a new status option to existing column
  onAddStatus?: (columnId: string, option: StatusOption) => void

  // Called when deleting a status option
  onDeleteStatus?: (columnId: string, statusId: string) => void

  // Called when updating a status option (rename or color change)
  onUpdateStatus?: (
    columnId: string,
    statusId: string,
    updates: Partial<StatusOption>
  ) => void

  // Called when clearing all status options
  onClearAllStatuses?: (columnId: string) => void
}
```

## Predefined Colors

8 beautiful status colors are available:

```typescript
export const DEFAULT_STATUS_COLORS: StatusColor[] = [
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'yellow', name: 'Yellow', color: '#F59E0B' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'purple', name: 'Purple', color: '#8B5CF6' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
  { id: 'gray', name: 'Gray', color: '#6B7280' },
  { id: 'indigo', name: 'Indigo', color: '#6366F1' }
]
```

## API Integration Example

### Complete Implementation with API Calls

```typescript
// 1. Add status column
const handleAddColumn = async (type: ColumnType, statusColor?: string) => {
  if (type === 'status') {
    const response = await fetch('/api/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'status',
        title: 'Status',
        initialColor: statusColor
      })
    })
    const newColumn = await response.json()
    // Update local state
    setColumns((prev) => [...prev, newColumn])
  }
}

// 2. Add status option to column
const handleAddStatus = async (columnId: string, option: StatusOption) => {
  await fetch(`/api/columns/${columnId}/statuses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(option)
  })
  // Update local state or refetch
}

// 3. Update status option
const handleUpdateStatus = async (
  columnId: string,
  statusId: string,
  updates: Partial<StatusOption>
) => {
  await fetch(`/api/columns/${columnId}/statuses/${statusId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
}

// 4. Delete status option
const handleDeleteStatus = async (columnId: string, statusId: string) => {
  await fetch(`/api/columns/${columnId}/statuses/${statusId}`, {
    method: 'DELETE'
  })
}

// 5. Clear all statuses
const handleClearAll = async (columnId: string) => {
  await fetch(`/api/columns/${columnId}/statuses`, {
    method: 'DELETE'
  })
}
```

## Features Summary

✅ **Nested Submenu**: Hover over "Status Pills" to see color options  
✅ **Color Selection**: 8 predefined colors + custom color picker  
✅ **Full CRUD**: Add, Read, Update, Delete status options  
✅ **Inline Editing**: Click on status label to edit  
✅ **Color Picker**: Native HTML color input for each status  
✅ **Clear All**: Bulk delete with one click  
✅ **Type Safe**: Full TypeScript support  
✅ **API Ready**: All handlers provided for backend integration  
✅ **Modular**: Reusable components across your app

## Notes

- Status column cells render as colored pill badges
- Color picker allows both predefined and custom hex colors
- All handlers are optional but recommended for full functionality
- Component is client-side only (uses "use client")
