import React, { useEffect, useSyncExternalStore } from 'react'
import { pb } from '../pb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Link } from '@nextui-org/react'
import { AiOutlineCopy, AiOutlineUpload } from 'react-icons/ai'
import { queryClient } from '../queryClient'

let isUploading = false

function usePasteImage(onPaste: (file: File) => void) {
  useEffect(() => {
    const cb = async (e: ClipboardEvent) => {
      if (isUploading) return

      isUploading = true
      // get file on event
      const file = e.clipboardData?.files?.[0]
      if (file) {
        // get file mime type
        const mimeType = file?.type
        // check if file is image
        if (mimeType?.startsWith('image/')) {
          // create form data
          onPaste(file)
        }
      }
    }

    window.addEventListener('paste', cb)

    return () => {
      return window.removeEventListener('paste', cb)
    }
  }, [])
}

function FileList() {

  const fileListQuery = useQuery({
    queryKey: ['fileList'],
    queryFn: async () => {
      const fileList = await pb.collection("images").getFullList({
        sort: '-created',
        expand: 'file'
      })
      return fileList
    }
  })

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24'>
        {fileListQuery.data?.map(file => {
          return (
            <div key={file.id} className='self-end'>
              <ImageItem record={file} />
            </div>
          )
        })}
      </div>
    </>
  )
}

function UploadButton(props: {
  // onUploadSuccess: (result: any) => void
}) {
  const uploadFileMutation = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const created = await pb.collection("images").create(formData)
      return created
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ['fileList']
      })
    },
    onSettled() {
      isUploading = false
    }
  })

  usePasteImage(uploadFileMutation.mutate)

  return (
    <>
      <Button isLoading={uploadFileMutation.isPending} color="primary" startContent={<AiOutlineUpload />}>Upload</Button>
    </>
  )
}

function App() {

  return (
    <>
      <div className='flex flex-col mt-12 max-w-[1280px] mx-auto'>
        <div className='p-6'>
          <UploadButton />
        </div>
        <div className='p-6'>
          <FileList />
        </div>
      </div>
    </>
  )
}

function ImageItem(props: {
  record: any,
}) {
  const getFileUrlQuery = useQuery({
    queryKey: ['file', props.record.file],
    queryFn: async () => {
      const fileUrl = await pb.getFileUrl(props.record, props.record.file)
      return fileUrl
    }
  })

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <Image src={getFileUrlQuery.data} />
      </div>
      <div className='flex justify-center'>
        <Button size="sm" variant="light" onClick={_ => {
          if (getFileUrlQuery.data) {
            navigator.clipboard.writeText(getFileUrlQuery.data)
          }
        }} startContent={<AiOutlineCopy />}>
          URL
        </Button>
      </div>
    </div>
  )
}

export const MainPage = App
