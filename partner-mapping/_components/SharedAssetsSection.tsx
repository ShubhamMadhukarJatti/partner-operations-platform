'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useCreatePartnerActivity } from '@/http-hooks/partner-activities'
import { RootState } from '@/redux/store'
import { FileText, Upload } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

import { useCreateSharedAsset, useSharedAssets } from '../api'
import { fetchSharedAssets, uploadSharedAssetFile } from '../api.server'
import { CreateSharedAssetResult, SharedAsset } from '../shared-assets.types'

const SHARED_ASSETS_FILE_INPUT_ID = 'shared-assets-file-input'
const SHARED_ASSETS_UPLOAD_ROOT_ID = 'shared-assets-upload-root'

const MAX_FILE_BYTES = 50 * 1024 * 1024
const ACCEPT =
  '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.gif,.webp'

function fileKey(f: File) {
  return `${f.name}-${f.size}-${f.lastModified}`
}

function mergePendingFiles(prev: File[], next: File[]): File[] {
  const seen = new Set(prev.map(fileKey))
  const out = [...prev]
  for (const f of next) {
    const k = fileKey(f)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(f)
    }
  }
  return out
}

type SharedAssetsSectionProps = {
  partnerOrgId: string
  dealId?: string | null
}

export function SharedAssetsSection({
  partnerOrgId,
  dealId
}: SharedAssetsSectionProps) {
  const numericId = useMemo(() => {
    const n = Number(partnerOrgId)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [partnerOrgId])

  const [isUploading, setIsUploading] = useState(false)
  const [localAssets, setLocalAssets] = useState<SharedAsset[]>([])
  const {
    data: fetchedAssets = [],
    isLoading,
    isError,
    error,
    refetch
  } = useSharedAssets(numericId, dealId)

  // Merge local (newly uploaded) assets with fetched assets
  const assets = useMemo(() => {
    const merged = [...fetchedAssets]
    const fetchedIds = new Set(fetchedAssets.map((a) => a.id))
    for (const local of localAssets) {
      if (!fetchedIds.has(local.id)) {
        merged.push(local)
      }
    }
    return merged
  }, [fetchedAssets, localAssets])

  const createAsset = useCreateSharedAsset(numericId)
  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const createActivityMutation = useCreatePartnerActivity(numericId, dealId)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [titleOverride, setTitleOverride] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [batchLabel, setBatchLabel] = useState<string | null>(null)

  const uploadDisabled = createAsset.isPending || numericId == null

  const processFiles = useCallback(
    async (files: File[], displayNameRaw: string) => {
      if (numericId == null) return
      setUploadError(null)

      const valid: File[] = []
      for (const f of files) {
        if (f.size > MAX_FILE_BYTES) {
          showCustomToast(
            'Error',
            `“${f.name}” is too large (max 50 MB).`,
            'error',
            5000
          )
          return
        }
        if (f.size === 0) continue
        valid.push(f)
      }
      if (valid.length === 0) {
        setUploadError('No valid files to upload.')
        return
      }

      const displayName = displayNameRaw.trim()
      if (!displayName) {
        const msg = 'Enter a display name before saving.'
        setUploadError(msg)
        showCustomToast('Error', msg, 'error', 5000)
        return
      }

      try {
        for (let i = 0; i < valid.length; i++) {
          const file = valid[i]
          setBatchLabel(`Uploading ${i + 1} of ${valid.length}…`)
          const title =
            valid.length === 1 ? displayName : `${displayName} — ${file.name}`

          const formData = new FormData()
          formData.append('file', file)
          formData.append('partnerOrgId', String(numericId))
          formData.append('title', title)
          if (dealId) {
            formData.append('dealId', dealId)
          }

          const result = (await createAsset.mutateAsync(
            formData
          )) as CreateSharedAssetResult
          if (result.ok && result.asset) {
            setLocalAssets((prev) => [result.asset, ...prev])
            if (numericId) {
              createActivityMutation.mutate({
                partnerOrgId: numericId,
                title: `Shared asset: ${title}`,
                description: `Uploaded new asset file for co-sell.`,
                activityType: 'asset_upload',
                userName: org?.name || 'Your team',
                dealId: dealId || ''
              })
            }
          }
        }

        showCustomToast(
          'Success',
          valid.length === 1
            ? `Shared “${displayName}”.`
            : `Shared ${valid.length} files as “${displayName}”.`,
          'success',
          5000
        )
        setTitleOverride('')
        setPendingFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
      } catch (e) {
        showCustomToast(
          'Error',
          e instanceof Error ? e.message : 'Upload failed.',
          'error',
          5000
        )
      } finally {
        setBatchLabel(null)
      }
    },
    [createAsset, numericId, createActivityMutation, org, dealId]
  )

  const handleSave = () => {
    if (numericId == null) return
    setUploadError(null)
    if (pendingFiles.length === 0) {
      const msg = 'Add at least one file before saving.'
      setUploadError(msg)
      showCustomToast('Error', msg, 'error', 5000)
      return
    }
    const displayName = titleOverride.trim()
    if (!displayName) {
      const msg = 'Enter a display name before saving.'
      setUploadError(msg)
      showCustomToast('Error', msg, 'error', 5000)
      return
    }
    void processFiles([...pendingFiles], displayName)
  }

  const queueFiles = (files: File[]) => {
    if (uploadDisabled || files.length === 0) return
    setUploadError(null)
    setPendingFiles((prev) => mergePendingFiles(prev, files))
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (list?.length) {
      queueFiles(Array.from(list))
      e.target.value = ''
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (uploadDisabled) return
    const list = e.dataTransfer.files
    if (list?.length) queueFiles(Array.from(list))
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploadDisabled) setDragOver(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const openPicker = () => {
    if (!uploadDisabled) fileInputRef.current?.click()
  }

  const onKeyDownZone = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPicker()
    }
  }

  if (numericId == null) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-[21px]'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Shared Assets
        </h2>
        <p className='mt-2 text-sm text-[#A91B22]'>
          Invalid partner organization. Assets are unavailable.
        </p>
      </section>
    )
  }

  const uploadBlock = (
    <div
      id={SHARED_ASSETS_UPLOAD_ROOT_ID}
      className='mt-4 space-y-3 rounded-[10px] border border-[#ECEEF2] bg-[#FAFBFC] p-4'
    >
      <input
        ref={fileInputRef}
        id={SHARED_ASSETS_FILE_INPUT_ID}
        type='file'
        multiple
        accept={ACCEPT}
        className='sr-only'
        tabIndex={-1}
        disabled={uploadDisabled}
        onChange={onInputChange}
      />
      <div
        role='button'
        tabIndex={uploadDisabled ? -1 : 0}
        onKeyDown={onKeyDownZone}
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        aria-disabled={uploadDisabled}
        className={cn(
          'cursor-pointer rounded-[10px] border-2 border-dashed px-6 py-10 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#3E50F7] focus-visible:ring-offset-2',
          uploadDisabled
            ? 'cursor-not-allowed border-[#E5E7EB] bg-[#F3F4F6] opacity-70'
            : dragOver
              ? 'border-[#3E50F7] bg-[#EEF2FF]'
              : 'border-[#D1D5DC] bg-[#F8F9FB] hover:border-[#94A3B8]'
        )}
      >
        <Upload
          className='mx-auto size-10 text-[#64748B]'
          strokeWidth={1.25}
          aria-hidden
        />
        <p className='mt-3 text-sm font-semibold text-[#1A1A2E]'>
          Drag and drop files here
        </p>
        <p className='mt-1 text-xs text-[#64748B]'>
          or click to browse — documents and images up to 50 MB each
        </p>
        {batchLabel ? (
          <p className='mt-3 text-xs font-medium text-[#3E50F7]'>
            {batchLabel}
          </p>
        ) : pendingFiles.length > 0 ? (
          <p className='mt-3 text-xs font-medium text-[#364153]'>
            {pendingFiles.length} file{pendingFiles.length === 1 ? '' : 's'}{' '}
            ready — enter a display name and click Save
          </p>
        ) : null}
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3'>
        <div className='min-w-0 flex-1 space-y-1'>
          <label
            htmlFor='shared-asset-display-name'
            className='block text-xs font-medium text-[#4D5C78]'
          >
            Display name{' '}
            <span className='text-[#A91B22]' aria-hidden>
              *
            </span>
          </label>
          <Input
            id='shared-asset-display-name'
            type='text'
            placeholder='e.g. Product overview deck'
            value={titleOverride}
            disabled={uploadDisabled}
            aria-required='true'
            onChange={(e) => {
              setTitleOverride(e.target.value)
              setUploadError(null)
            }}
            className='h-9 w-full rounded-lg border-[#E0E4EB] bg-white text-[13px]'
          />
        </div>
        <Button
          type='button'
          variant='primary'
          size='sm'
          className='h-9 shrink-0 px-5 sm:self-end'
          disabled={uploadDisabled || pendingFiles.length === 0}
          onClick={handleSave}
        >
          {createAsset.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {uploadError ? (
        <p className='text-sm text-[#A91B22]'>{uploadError}</p>
      ) : null}
    </div>
  )

  if (isLoading) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Shared Assets
        </h2>
        {uploadBlock}
        <ul className='mt-6 space-y-0 divide-y divide-[#ECEEF2]' aria-hidden>
          {[1, 2, 3].map((i) => (
            <li key={i} className='flex items-center gap-3 py-3.5'>
              <Skeleton className='size-9 shrink-0 rounded-md' />
              <div className='min-w-0 flex-1 space-y-2'>
                <Skeleton className='h-4 w-2/3 max-w-xs' />
              </div>
              <Skeleton className='h-3 w-28 shrink-0' />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Shared Assets
        </h2>
        {uploadBlock}
        <p className='mt-4 text-sm text-[#A91B22]'>
          {error instanceof Error
            ? error.message
            : 'Could not load shared assets.'}
        </p>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-3'
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </section>
    )
  }

  return (
    <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
      <h2 className='mb-1 text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
        Shared Assets
      </h2>
      {uploadBlock}
      {assets.length === 0 ? (
        <p className='mt-6 text-sm text-[#64748B]'>
          No assets have been shared for this co-sell workspace yet.
        </p>
      ) : (
        <ul className='mt-6 divide-y divide-[#ECEEF2]'>
          {assets.map((asset) => {
            const hasUrl =
              typeof asset.fileUrl === 'string' &&
              asset.fileUrl.trim().length > 0 &&
              asset.fileUrl.trim() !== 'null'
            const title =
              typeof asset.title === 'string' && asset.title.trim()
                ? asset.title.trim()
                : 'Untitled'
            const sharedBy =
              typeof asset.sharedBy === 'string' && asset.sharedBy.trim()
                ? asset.sharedBy.trim()
                : 'Unknown'

            const content = (
              <>
                <span className='flex size-9 shrink-0 items-center justify-center rounded-md border border-[#E8EAEF] bg-[#F8F9FB] text-[#4D5C78]'>
                  <FileText className='size-4' aria-hidden />
                </span>
                <span className='min-w-0 flex-1 text-left'>
                  <p className='truncate text-[13px] font-medium leading-[21px] tracking-[-0.076px] text-[#1A1A2E]'>
                    {title}
                  </p>
                  <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#64738D]'>
                    Shared by {sharedBy}
                  </p>
                </span>
                <span className='shrink-0 text-[11px] font-semibold text-[#3E50F7] hover:underline'>
                  View File
                </span>
              </>
            )

            if (hasUrl) {
              return (
                <li key={asset.id}>
                  <a
                    href={asset.fileUrl.trim()}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex w-full items-center gap-3 py-3.5 transition-colors hover:bg-[#FAFBFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E50F7] focus-visible:ring-offset-2'
                  >
                    {content}
                  </a>
                </li>
              )
            }

            return (
              <li
                key={asset.id}
                className='flex cursor-not-allowed items-center gap-3 py-3.5 opacity-60'
                title='No file link available'
              >
                {content}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export { SHARED_ASSETS_FILE_INPUT_ID, SHARED_ASSETS_UPLOAD_ROOT_ID }
