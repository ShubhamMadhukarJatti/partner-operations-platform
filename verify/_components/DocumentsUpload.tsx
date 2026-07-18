import React, { ChangeEvent, useRef, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const DocumentsUpload = () => {
  const panFileRef = useRef<any>()

  const [files, setFiles] = useState<File[]>([])
  const [uploadStatuses, setUploadStatuses] = useState<{
    [key: string]: boolean
  }>({})
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      setUploading(true)
      for (const file of newFiles) {
        await uploadFile(file)
      }

      //   setUploading(false)
    }
  }
  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('document', file, file.name)

    try {
      const response = await axios.post(
        `/api/upload-document?organizationId=${207}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      setUploadStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file.name]: true
      }))
      return response.data
    } catch (error) {
      console.error('Error uploading file:', file.name, error)
      setUploadStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file.name]: false
      }))
      throw error
    }
  }

  function formatFileSize(sizeInBytes: number) {
    if (sizeInBytes >= 1024 * 1024) {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB'
    } else if (sizeInBytes >= 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' KB'
    } else {
      return sizeInBytes + ' bytes'
    }
  }

  return (
    <>
      {!uploading ? (
        <div
          onClick={() => {
            panFileRef.current.click()
          }}
          className='mt-9 flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#475467] p-4'
        >
          <Image
            src={'/icons/uplaod.svg'}
            alt='uplaod-icon'
            height={36}
            width={36}
          />
          <Input
            className='hidden'
            type='file'
            multiple
            accept='application/pdf'
            ref={panFileRef}
            onChange={handleFileChange}
          />
          <p className='mt-3 text-base font-medium'>Upload Scanned Pancard</p>
          <p className='mt-1 text-sm font-medium text-[#475467]'>
            PDF format, upto 5MB
          </p>
          <Button className='mt-5 rounded-md border-2 border-[#101828] bg-transparent text-[#101828] hover:bg-transparent'>
            Browse Files
          </Button>
        </div>
      ) : (
        <div className='mt-4 flex flex-col gap-1'>
          {files.map((file) => (
            <div
              key={file.name}
              className='flex items-center gap-2 rounded-lg border border-[#D4D4D4]  bg-white px-3 py-2 shadow-md'
            >
              <Image
                src={'/icons/pdf-icon.svg'}
                alt=''
                width={28}
                height={28}
              />

              <div className='flex flex-col items-start gap-0.5'>
                <p className='text-xs  font-medium'>{file.name}</p>
                <p className='inline-flex gap-2 text-xs text-[#475467] '>
                  {' '}
                  {formatFileSize(file.size)}{' '}
                  {uploadStatuses[file.name] ? (
                    <span className='flex items-center gap-1'>
                      {' '}
                      <CircleCheck className='size-4 rounded-full text-green-600' />{' '}
                      Completed{' '}
                    </span>
                  ) : (
                    <span>Uploading...</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default DocumentsUpload
