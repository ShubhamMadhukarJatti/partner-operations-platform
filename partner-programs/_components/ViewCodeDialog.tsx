import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import {
  usePartnerPrograms,
  useReferralPartnerInvite
} from '@/http-hooks/partner-programs'
import { Check, Copy } from 'iconsax-react'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CodeBlock } from '@/components/ui/code-block'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'

const ViewCodeDialog: React.FC<{ referralCode: string }> = ({
  referralCode
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (script: string) => {
    const textToCopy = script
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    // setCopied(true)
    // setTimeout(() => setCopied(false), 2000)
  }

  const script = `
    <script>
    // this will give the impression data 
    function executeImpressionApi() {
    
    var referralCode = "${referralCode}";
    
    var impressionApiUrl = "${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=" + referralCode + "&type=impression";
    
    
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', impressionApiUrl, true);
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
    
        if (xhr.status === 200) {
    
            console.log("Impression successfully tracked!");
    
        } else {
    
            console.log("Failed to track impression!");
    
        }
    
    };
    
    xhr.onerror = function() {
    
        console.error("Error tracking impressions");
    
    };
    
    xhr.send();
    
    }
    // this function will be called onClick  , name of function  should be match  as Onclick calling function name 
    function submitForm(event) {
    
    event.preventDefault();
    
    var referralCode = "${referralCode}"; 
    
    var name = encodeURIComponent(document.getElementById('name').value);
    
    var email = encodeURIComponent(document.getElementById('email').value);
    
    var phone = encodeURIComponent(document.getElementById('phone').value);
    
    
    // this will give the lead data 
    
    var leadApiUrl = "${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=" + referralCode + "&name=" + name + "&email=" + email + "&mobile=" + phone + "&type=lead";
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', leadApiUrl, true);
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
    
        if (xhr.status === 200) {
    
            console.log("Lead successfully tracked!");
    
        } else {
    
            console.log("Failed to track lead!");
    
        }
    
    };
    
    xhr.onerror = function() {
    
        console.error("Error tracking lead");
    
    };
    
    xhr.send();
    
    }
    
    window.onload = function() {
    
    executeImpressionApi();
    
    };
    
    </script>
                    `
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='link'
          className='text-shark-sm font-semibold text-primary-blue'
          size='sm'
        >
          View Code
        </Button>
      </DialogTrigger>
      <DialogContent className='m-0 h-screen w-screen max-w-none rounded-none bg-[#F9FAFB] p-0'>
        <div className='hide-scrollbar relative mx-auto w-full max-w-[700px] overflow-y-scroll py-8'>
          <div className='px-4'>
            {/* Copy Code Snippet */}
            <div className='mb-5'>
              <h2 className='mb-1 text-shark-sm font-semibold text-[#414651]'>
                Copy Code Snippet
              </h2>
              <p className='mb-2 text-shark-sm text-[#535862]'>
                Enter information here about this section
              </p>

              <div className='relative overflow-hidden rounded-md border bg-gray-50'>
                <CodeBlock
                  language='js'
                  filename='referralCode.jsx'
                  highlightLines={[9, 13, 14, 18]}
                  code={script}
                />
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute right-2 top-2 border bg-white shadow-sm'
                  onClick={() => handleCopy(script)}
                >
                  {copied ? (
                    <Check className='mr-1 h-4 w-4' />
                  ) : (
                    <Copy className='mr-1 h-4 w-4' />
                  )}
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCodeDialog
