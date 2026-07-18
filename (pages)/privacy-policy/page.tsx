import React from 'react'
import Markdown from 'react-markdown'

const privacyPolicy = `

This privacy policy sets out how Kalasa Agile Pvt Ltd uses and protects any information that you provide when visiting the website, purchasing from us, or using our services.
Kalasa Agile Pvt Ltd is committed to ensuring that your privacy is protected. Any information provided will only be used in accordance with this privacy statement.
Kalasa Agile Pvt Ltd may update this policy from time to time. We encourage you to periodically check this page to ensure you are aware of any changes.
________________


What We Collect
We may collect the following information:
* Name
* Contact information (including email address)
* Demographic information (such as postcode, preferences, and interests)
* Any information relevant to surveys or offers
________________



At Sharkdom, we prioritize your privacy and are committed to protecting your
personal data. This privacy policy outlines how we collect, use, and share the
data of users interacting with our services, including any Google user data we
access through our integrations.


What We Do with the Information
We require this information for the following purposes:
* Internal record keeping
* Improving products and services
* Sending promotional emails, if opted in
* Contacting you for market research (via email, phone, fax, or mail)
* Website customization based on your preferences
________________


Data Protection & Security
We are committed to ensuring that your data is secure. To prevent unauthorized access or disclosure, we have implemented suitable physical, electronic, and managerial procedures to safeguard the information we collect online.
Additionally, if we collect personal information through third-party services (e.g., Google for calendar setups or customer data), these services are only accessed with your explicit permission.
________________


Use of Third-Party Services (e.g., Google OAuth Scopes)
When using third-party services like Google Calendar or Google Sheets, we only request the permissions necessary to provide the service. The specific scopes we request for Google integrations are as follows:
* Google Calendar: Read and write access to manage meetings set up via the platform.
* Google Sheets: Read access to retrieve and analyze customer data as required, after you provide the relevant Google Sheets link and grant permission.
These permissions are used solely to improve your experience within the platform and to help create customized customer personas.


How We Use Google User Data:

We collect and use Google user data solely to provide and improve the
services you request. Specifically:

* Service Provision: We use your Google Calendar data to allow you to
schedule, manage, and synchronize events, as well as to provide related
notifications. For example, if you use our event scheduling feature, we will
access your Google Calendar to create and display your events.

* Communications: We may use your email or other information to send
notifications related to the events you have scheduled, provide reminders, or
notify you of any updates to the services you are using.

* Internal Improvements: We may also analyze user data to enhance our
services, such as improving the user experience or troubleshooting issues.
We do not use Google user data for purposes unrelated to providing these
services. We also do not sell your data to any third parties.

*Sharkdom’s use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy, including the Limited Use requirements.

*We only use your data to provide the intended functionality within the Sharkdom platform. This includes features powered by AI/ML models, such as automated insights and productivity enhancements, which may interact with user data obtained through Google Workspace APIs and/or Photos APIs.

*Our AI/ML models process this data solely to enable the intended functionality for the end user. We do not use your Google user data to train any generalized AI/ML models, and we do not share it with third parties unless explicitly authorized by you.

*We strictly comply with Google's Limited Use policy in all data access and processing operations.

Sharing, Transferring, and Disclosing Google User Data :
Your Google user data is not shared, transferred, or disclosed to third parties,
except in the following circumstances:

* Service Providers: We may share your information with trusted partners who
assist us in providing our services, such as cloud hosting providers or
payment processors. These partners are obligated to protect your data and
may only use it for the purposes outlined in this policy.

* Legal Compliance: We may disclose your data if required to do so by law,
such as in response to a legal request by public authorities, including to meet
national security or law enforcement requirements.

* Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your data may be transferred to the acquiring organization. However, we will ensure that your privacy continues to be
protected and that the terms of this privacy policy are upheld.
We do not transfer or disclose your information to third parties for purposes
other than those provided in this policy.


________________


Data Retention & Deletion
We only retain your data for as long as it is necessary to fulfill the purposes outlined in this policy. After this period, we securely delete or anonymize your data. If you would like to request data deletion, you can do so by contacting us at the address below.
________________


Your Data Rights
You have the right to:
* Access the personal data we hold on you.
* Request correction or deletion of your data at any time.
* Restrict the processing of your personal data.
If you would like to exercise these rights, please contact us using the details at the bottom of this page.
________________
Cookies
Our website uses cookies to analyze web traffic and customize your experience. You can choose to accept or decline cookies through your browser settings.
________________

Data Retention Policy
We retain your personal data only for as long as necessary to meet legal, regulatory, and operational obligations. After this period, your data is securely deleted unless you have requested its deletion earlier.
________________

Data Deletion Policy
Users may request the deletion of their personal data by emailing us. Once verified, we will delete your information and notify you of the successful completion. For data that is retained for legal or regulatory reasons, we will inform you accordingly.
________________


**Contact Information:**

If you have any questions about this privacy policy or if you believe any information we hold is incorrect, please contact us at:

Kalasa Agile Pvt Ltd
Muqbool Road, Amritsar, Punjab 143001

Email: office@sharkdom.com

Phone: +91 97799-87613
`

const PolicyPage = () => {
  return (
    <div className='mx-auto max-w-5xl px-4 py-12'>
      <h1 className='mb-4 text-3xl font-bold text-primary md:text-4xl'>
        Privacy Policy
      </h1>
      <div className='mb-6 h-[2px] w-20 bg-primary' />

      <div>
        <p className='mb-6 text-base font-medium text-muted-foreground'>
          Last updated on Sep 08th, 2024
        </p>

        <Markdown className='prose prose-lg max-w-none text-muted-foreground'>
          {privacyPolicy}
        </Markdown>
      </div>
    </div>
  )
}

export default PolicyPage
