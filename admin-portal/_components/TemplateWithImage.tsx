'use client'

import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { ChevronDownIcon } from 'lucide-react'

import { dbFirebase } from '@/lib/firebase/config/client-config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

// Initialize Firebase

const TemplateWithImage = () => {
  const [docId, setDocId] = useState('')
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [heading, setHeading] = useState('')
  const [content, setContent] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [output, setOutput] = useState('')

  const generateAndSave = async () => {
    if (!docId) {
      alert('Please enter a Template Code')
      return
    }

    const html = `

<!DOCTYPE html> <html lang="en"> <head>  <meta charset="UTF-8" />  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>  <title>Sharkdom Invitation</title>  <style>   body {    margin: 0;    padding: 0;    font-family: Arial, sans-serif;       background-size: cover;   }   .email-container {    width: 600px;    margin: 0 auto;    background: url('https://storage.googleapis.com/sharkdom_resources/new_stripe_back.png') repeat;   }   .top-section {       background-size: cover;    text-align: center;    padding: 40px 20px 60px;   }   .logo-pill {    background: white;    padding: 20px 40px;    border-radius: 50px;    display: inline-block;    box-shadow: 0 8px 0 #1d2746;   }   .logo-pill img {    height: 32px;   }   .heading {    font-size: 25px;    font-weight: 400;    color: #2f2f2f;    margin: 30px 0 10px;    text-align: left;   }   .subheading {    font-size: 16px;    color: #555;   line-height: 1.8;    margin-top: 20px;    text-align: left;   }   .invite-btn {    background-color: #2F52EB;    color: white;    padding: 14px 36px;    font-size: 16px;    font-weight: bold;    border-radius: 30px;    text-decoration: none;    display: inline-block;    margin-top: 20px;    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);   }   .card {    background-color: white;    border-radius: 10px;    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);    padding: 20px;    margin: 40px 20px;    position: relative;    display: flex;    justify-content: space-between;    align-items: center;   }   .card-content {    width: 60%;   }   .card h3 {    margin: 0 0 10px;    font-size: 20px;    color: #222;   }   .card p {    font-size: 14px;    color: #444;    margin-bottom: 12px;   }   .card a {    font-size: 14px;    font-weight: bold;    color: #2F52EB;    text-decoration: none;   }   .card-image {    width: 35%;   }   .card-image img {    width: 100%;    border-radius: 6px;   }   .badge {    position: absolute;    top: -10px;    right: -10px;    width: 70px;   }    .footer-wrapper {   position: relative;      }  .footer {   background-color: white;   text-align: center;   padding: 20px 20px 25px;   position: relative;   z-index: 2;   margin-top: -5px;   background: url('https://storage.googleapis.com/sharkdom_resources/white_curve.png') repeat;  }    .footer table {    width: 100%;   }   .footer-logo {    font-weight: bold;    font-size: 20px;    margin-bottom: 5px;   }   .footer-desc {    font-size: 14px;    color: #555;   }   .social-icons {    text-align: right;   }   .social-icons img {    width: 24px;    margin: 0 6px;   }   .footer-links {    margin-top: 25px;    text-align: left;   }   .footer-links a {    margin: 0 12px;    color: #2F52EB;    text-decoration: none;    font-weight: 500;    text-align: left;   }   .copyright {    margin-top: 20px;    font-size: 14px;    color: #666;    text-align: left;   } .plan-details-container {   background-color: #ffffff;   border-radius: 12px;   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);   padding: 24px;   margin: 40px 20px;   font-family: Arial, sans-serif;  }  .plan-details-title {   font-size: 20px;   font-weight: bold;   color: #2F52EB;   margin-bottom: 16px;   border-bottom: 1px solid #eee;   padding-bottom: 8px;  }  .plan-detail {   display: flex;   justify-content: space-between;   margin: 12px 0;   font-size: 15px;   color: #444;  }  .plan-detail label {   font-weight: 600;   color: #222;   flex: 1;  }  .plan-detail span {   flex: 2;   text-align: right;   font-weight: 500;  }     @media (max-width: 620px) {    .email-container {     width: 100% !important;    }    .card {     flex-direction: column;     text-align: center;    }    .card-content, .card-image {     width: 100%;    }    .badge {     width: 50px;    }    .plan-detail {    flex-direction: column;    align-items: flex-start;   }   .plan-detail span {    text-align: left;    margin-top: 4px;   }      }  </style> </head> <body>

<div class="email-container">   <!-- TOP -->   <div class="top-section">    <img src="https://storage.googleapis.com/sharkdom_resources/Group 1000004999.png" alt="Sharkdom Logo" />

<div class="heading">${heading}</div>

<div class="subheading">${content}</div>    </div>   <table width="100%" cellpadding="0" cellspacing="0" border="0">  <tr>   <td style="padding: 20px;">    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center;">     <tr>      <td style="padding: 24px;">       <div style="font-size: 18px; font-weight: 500; color: #333; padding-bottom: 12px; margin-bottom: 12px;">        <span style="border-top: 1px solid #ccc; display: inline-block; width: 20%; vertical-align: middle; margin-right: 10px;"></span>        Let’s get started        <span style="border-top: 1px solid #ccc; display: inline-block; width: 20%; vertical-align: middle; margin-left: 10px;"></span>       </div>        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">        <tr>         <td width="60%" style="text-align: left; padding-right: 10px;">          <h3 style="font-size: 18px; margin: 0 0 6px; color: #222;">Quickly add teammates</h3>          <p style="font-size: 14px; color: #555; margin: 0 0 10px;">           Share this link to easily invite people to your team to join your workspace          </p>          <a href="#" style="color: #2F52EB; font-size: 14px; font-weight: bold; text-decoration: none;">           Invite teammates →          </a>         </td>         <td width="40%" style="text-align: right;">          <img src="${imageURL}" width="100%" style="border-radius: 6px;" alt="Add teammates image" />         </td>        </tr>       </table>       <!-- Block 2 -->       <table width="100%" cellpadding="0" cellspacing="0">        <tr>         <td width="60%" style="text-align: left; padding-right: 10px;">          <h3 style="font-size: 18px; margin: 0 0 6px; color: #222;">Add your partner match</h3>          <p style="font-size: 14px; color: #555; margin: 0 0 10px;">           Your customer persona for finding your IPP (Ideal Partner Profile) is just 2 clicks          </p>          <a href="#" style="color: #2F52EB; font-size: 14px; font-weight: bold; text-decoration: none;">           Open partner match          </a>         </td>         <td width="40%" style="text-align: right;">          <img src="${imageURL}" width="100%" style="border-radius: 6px;" alt="Partner match image" />         </td>        </tr>       </table>      </td>     </tr>    </table>   </td>  </tr> </table>

<div class="footer-wrapper">

<div class="footer">

<table cellpadding="0" cellspacing="0" width="100%">    <tr>     <td align="left">     <div style="text-align: left; margin-top: 60px; margin-bottom: 20px;">  <img src="https://storage.googleapis.com/sharkdom_resources/Group.png" alt="Sharkdom Logo" style="height: 32px; display: block; margin-bottom: 6px;" /> <div class="footer-desc">Your GTM platform for partnerships</div>  </div>     </td>     <td align="right" class="social-icons">      <img src="https://img.icons8.com/ios-filled/24/1A1A1A/facebook-new.png" alt="Facebook" />      <img src="https://img.icons8.com/ios-filled/24/1A1A1A/twitter.png" alt="Twitter" />      <img src="https://img.icons8.com/ios-filled/24/1A1A1A/youtube-play.png" alt="YouTube" />      <img src="https://img.icons8.com/ios-filled/24/1A1A1A/linkedin.png" alt="LinkedIn" />     </td>    </tr>   </table>     <table cellpadding="0" cellspacing="0" width="100%">    <tr>     <td align="left">      <div class="footer-links">       <a href="#">Blog</a>       <a href="#">Help centre</a>       <a href="#">Policies</a>      </div>     </td>        </tr>   </table>   <div class="copyright">    © 2025 Kalasa Agile Private Limited, Inc. All rights reserved   </div>  </div> </div>  </div>

</body> </html>

`

    const data = {
      sender: sender,
      subject: subject,

      templateDescription: templateDescription,

      bodyHtml: html
    }

    try {
      await setDoc(doc(dbFirebase, 'EmailTemplates', docId), data)
      setOutput(
        `Email template saved to Firestore with Template Code: ${docId}`
      )
      showCustomToast('Success', 'Emal template added', 'success', 5000)
      setDocId('')
      setSender('')
      setSubject('')
      setTemplateDescription('')
      setHeading('')
      setContent('')
      setImageURL('')
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
    <div className='p-6'>
      <div className='mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md'>
        <Collapsible>
          <CollapsibleTrigger className='flex w-full items-center justify-between p-0'>
            <h2 className='text-2xl font-semibold'>
              Generate Sharkdom HTML Email
            </h2>
            <ChevronDownIcon />
          </CollapsibleTrigger>
          <CollapsibleContent className='mt-4 p-0'>
            <label className='font-semibold'>Template Code:</label>
            <Input
              type='text'
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder='Enter Template Code'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>Sender Email:</label>
            <Input
              type='email'
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder='Team SharkDom no-reply@sharkdom.com'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>Subject:</label>
            <Input
              type='text'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Enter email subject'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>
              Template Description:
            </label>
            <Input
              type='text'
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder='Enter a short description of the email template'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>Main Heading:</label>
            <Input
              type='text'
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder='Enter the email heading'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder='This content will contain <java> tag'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <label className='mt-4 block font-semibold'>GCP Image URL:</label>
            <Input
              type='text'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder='https://storage.googleapis.com/sharkdom_resources/...'
              className='mt-2 w-full rounded-md border border-gray-300 p-2'
            />

            <button
              onClick={() => generateAndSave()}
              className='mt-6 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
            >
              Generate and Save
            </button>

            {output && (
              <div className='mt-10 whitespace-pre-wrap rounded-md border border-gray-300 bg-white p-4'>
                {output}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default TemplateWithImage
