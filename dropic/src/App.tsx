import React from 'react'
import { pb } from './pb'
import { useQuery } from '@tanstack/react-query'

function App() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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
    {fileListQuery.data?.map(file => {
      return (
        <div>
          <ImageItem record={file} />
        </div>
      )
    })}
      <form onSubmit={async e => {
        e.preventDefault()

        const file = fileInputRef.current?.files?.[0]
        if (file) {
          const formData = new FormData()
          formData.append("file", file)
          const created = await pb.collection("images").create(formData)
          console.log(created)
        }
      }}>
        <input ref={fileInputRef} type="file" />
        <div>
          <button type="submit">upload</button>
        </div>
      </form> 
      
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
    <div>
      <div>
        {props.record.file}
      </div> 
      <div>
        {getFileUrlQuery.data}
      </div>
    </div>
  )
}

export default App
