'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

import { getServerUser } from '@/lib/server'
import AppIcon from '@/components/ui/app-icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type { AppType, TrelloBoard, TrelloBoardsResponse } from './types'

interface AppConnectionBannerProps {
  selectedApp: AppType
  selectedBoard: string
  onBoardChange: (value: string) => void
}

const AppConnectionBanner: React.FC<AppConnectionBannerProps> = ({
  selectedApp,
  selectedBoard,
  onBoardChange
}) => {
  const [boards, setBoards] = useState<TrelloBoard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrelloBoards = async () => {
      if (selectedApp !== 'trello') {
        // Reset boards if not Trello
        setBoards([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { token } = await getServerUser()
        if (!token) {
          throw new Error('No authentication token found')
        }
        const response = await fetch('/api/api/gtm/trello/boards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization token from your auth context/session
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch Trello boards')
        }

        const data: TrelloBoardsResponse = await response.json()

        if (data.success) {
          setBoards(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch boards')
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error fetching Trello boards:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrelloBoards()
  }, [selectedApp])

  const getAppName = (app: AppType) => {
    switch (app) {
      case 'trello':
        return 'Trello'
      case 'notion':
        return 'Notion'
      case 'plus':
        return 'Other App'
      default:
        return 'Unknown App'
    }
  }

  return (
    <div
      className='overflow-hidden rounded-2xl border border-[#DFE3E8] p-4'
      style={{
        background:
          'linear-gradient(82.58deg, rgba(74, 164, 217, 0.06) 18.53%, rgba(30, 85, 202, 0.06) 40.84%, rgba(93, 68, 205, 0.06) 60.49%, rgba(84, 66, 194, 0.02715) 92.66%, rgba(33, 55, 129, 0) 150.53%)'
      }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg'>
            <AppIcon app={selectedApp} size={24} />
          </div>
          <div>
            <h3 className='text-base font-semibold text-text-100'>
              {getAppName(selectedApp)}
            </h3>
            <p className='text-sm text-text-60'>
              Select the board to import here
            </p>
          </div>
        </div>
        <div className='min-w-48'>
          {isLoading ? (
            <div className='flex h-10 items-center justify-center'>
              <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
            </div>
          ) : (
            <Select
              value={selectedBoard}
              onValueChange={onBoardChange}
              disabled={selectedApp === 'trello' && boards.length === 0}
            >
              <SelectTrigger className='h-10 rounded-2xl border-[#DFE3E8] text-xs text-text-60 backdrop-blur-sm placeholder:text-text-60'>
                <SelectValue
                  placeholder={
                    selectedApp === 'trello' && boards.length === 0
                      ? 'No boards available'
                      : 'Select the board'
                  }
                  className='text-text-60'
                />
              </SelectTrigger>
              <SelectContent>
                {selectedApp === 'trello' && boards.length > 0
                  ? boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))
                  : selectedApp !== 'trello' && (
                      <>
                        <SelectItem value='board1'>Marketing Board</SelectItem>
                        <SelectItem value='board2'>
                          Development Tasks
                        </SelectItem>
                        <SelectItem value='board3'>Content Planning</SelectItem>
                      </>
                    )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {error && selectedApp === 'trello' && (
        <div className='mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3'>
          <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-600' />
          <p className='text-sm text-red-800'>{error}</p>
        </div>
      )}
    </div>
  )
}

export default AppConnectionBanner
