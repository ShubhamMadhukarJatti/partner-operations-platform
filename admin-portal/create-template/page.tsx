import React from 'react'

import AdminHeader from '../_components/admin-header'
import TemplateTextEditor from '../_components/TemplateTextEditor'
import TemplateWithImage from '../_components/TemplateWithImage'

const CreateTemplate = () => {
  return (
    <div className='min-h-screen bg-gray-100 pb-6'>
      <AdminHeader />
      <TemplateWithImage />
      <TemplateTextEditor />
    </div>
  )
}

export default CreateTemplate
