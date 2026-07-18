'use client'

import React, { useRef, useState } from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

import { doc, setDoc } from 'firebase/firestore'
import { ChevronDown } from 'lucide-react'

import { dbFirebase } from '@/lib/firebase/config/client-config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

const TemplateTextEditor = () => {
  const [docId, setDocId] = useState('')
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [output, setOutput] = useState('')
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const savedRange = useRef(null)
  const [textValue, setTextValue] = useState('')

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);

  // useEffect(() => {
  //     if (editorRef.current && !quillRef.current) {
  //         quillRef.current = new Quill(editorRef.current, {
  //             theme: 'snow',
  //             modules: {
  //                 toolbar: {
  //                     container: '#toolbar'
  //                 }
  //             },
  //             formats: ['bold', 'italic', 'underline', 'list', 'link', 'clean'],
  //             placeholder: 'Write your email content here...'
  //         });

  //         quillRef.current.getModule('toolbar').addHandler('link', () => {
  //             savedRange.current = quillRef.current.getSelection();
  //             const text = quillRef.current.getText(
  //                 savedRange.current.index,
  //                 savedRange.current.length
  //             );
  //             const url = prompt('Enter URL:');
  //             if (url) {
  //                 quillRef.current.deleteText(
  //                     savedRange.current.index,
  //                     savedRange.current.length
  //                 );
  //                 quillRef.current.insertText(
  //                     savedRange.current.index,
  //                     text,
  //                     'link',
  //                     url
  //                 );
  //             }
  //         });
  //     }
  // }, []);

  // const insertLineBreak = () => {
  //     const range = quillRef.current.getSelection(true);
  //     if (range) {
  //         quillRef.current.insertText(range.index, '\n');
  //         quillRef.current.setSelection(range.index + 1);
  //     }
  // };

  const generateRichTextEmail = async () => {
    if (!docId.trim()) {
      alert('Please enter a Template Code.')
      return
    }

    const html = textValue
    const templateData = {
      sender,
      subject,
      templateDescription,
      bodyHtml: html
    }

    try {
      await setDoc(doc(dbFirebase, 'EmailTemplates', docId), templateData)
        .then(() => {
          setOutput(
            `Email template saved to Firestore with Template Code: ${docId}`
          )
          showCustomToast('Success', 'Emal template added', 'success', 5000)
          setDocId('')
          setSender('')
          setSubject('')
          setTemplateDescription('')
        })
        .catch((error) => {
          console.error('Error saving to Firestore:', error)
          showCustomToast(
            'Error',
            'Failed to save. Check console for errors.',
            'error',
            5000
          )
        })
    } catch (error) {
      console.error('Error saving to Firestore:', error)
      showCustomToast(
        'Error',
        'Failed to save. Check console for errors.',
        'error',
        5000
      )
    }
  }

  return (
    <div className='mx-auto mt-10 max-w-3xl rounded-lg bg-white p-6 shadow-md'>
      <Collapsible>
        <CollapsibleTrigger className='flex w-full items-center justify-between p-0'>
          <h2 className='text-2xl font-bold'>
            Sharkdom Template Email Generator
          </h2>
          <ChevronDown />
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-6 p-0'>
          <label className='font-semibold'>Template Code:</label>
          <Input
            type='text'
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            className='mb-4 mt-1 w-full rounded border p-2'
            placeholder='Enter Template Code'
          />

          <label className='font-semibold'>Sender Email:</label>
          <Input
            type='email'
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className='mb-4 mt-1 w-full rounded border p-2'
            placeholder='Team SharkDom no-reply@sharkdom.com'
          />

          <label className='font-semibold'>Subject:</label>
          <Input
            type='text'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className='mb-4 mt-1 w-full rounded border p-2'
            placeholder='Enter email subject'
          />

          <label className='font-semibold'>Template Description:</label>
          <Input
            type='text'
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            className='mb-4 mt-1 w-full rounded border p-2'
            placeholder='Enter a short description'
          />

          <label className='font-semibold'>Email Content:</label>
          <ReactQuill theme='snow' value={textValue} onChange={setTextValue} />

          <button
            onClick={generateRichTextEmail}
            className='mt-6 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          >
            Generate and Save
          </button>

          {output && (
            <div className='mt-8 whitespace-pre-wrap rounded border bg-gray-100 p-4 text-gray-800'>
              {output}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default TemplateTextEditor
