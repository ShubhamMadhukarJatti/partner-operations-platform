export interface EmailTemplate {
  id: string
  subject: string
  body: string
  tone?: string
  cta?: string
  estimated_reply_probability?: number
  rationale?: string
}

export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    subject: 'Partnership Opportunity with Your Business',
    body: `
      <p>Dear Partner,</p>
      <p>I hope this email finds you well. I'm reaching out to discuss an exciting partnership opportunity that could benefit both our organizations.</p>
      <p>Our company specializes in providing innovative solutions that have helped numerous businesses increase their efficiency by up to 40%. We believe that by working together, we can create significant value for both our customer bases.</p>
      <p><strong>Key Benefits of Partnership:</strong></p>
      <ul>
        <li>Access to our extensive network of industry contacts</li>
        <li>Co-marketing opportunities to expand market reach</li>
        <li>Shared resources for enhanced service delivery</li>
        <li>Revenue sharing model with competitive terms</li>
      </ul>
      <p>I would love to schedule a brief call next week to discuss how we can collaborate. Please let me know your availability.</p>
      <p>Best regards,<br/>Your Name</p>
    `
  },
  {
    id: '2',
    subject: 'Follow-up: Our Recent Discussion',
    body: `
      <p>Hi there,</p>
      <p>Thank you for taking the time to speak with me yesterday. I enjoyed our conversation about your company's growth plans and current challenges.</p>
      <p>As discussed, I'm attaching additional information about our services that directly address the pain points you mentioned:</p>
      <ol>
        <li><strong>Scalability Solutions:</strong> Our platform can handle up to 10x growth without infrastructure changes</li>
        <li><strong>Cost Optimization:</strong> Average client savings of 30% in operational costs</li>
        <li><strong>Integration Support:</strong> Seamless connection with your existing tools</li>
      </ol>
      <p>I'd be happy to arrange a demo for your team to see these features in action. We have slots available next Tuesday or Thursday afternoon.</p>
      <p>Looking forward to your response!</p>
      <p>Warm regards,<br/>Your Name</p>
    `
  },
  {
    id: '3',
    subject: 'Introducing Our New Service Offering',
    body: `
      <p>Dear Valued Partner,</p>
      <p>We're excited to announce the launch of our new premium service tier, designed specifically for businesses like yours.</p>
      <p><strong>What's New:</strong></p>
      <ul>
        <li>24/7 dedicated support team</li>
        <li>Custom integration capabilities</li>
        <li>Advanced analytics dashboard</li>
        <li>Priority feature requests</li>
      </ul>
      <p>As one of our valued partners, you're eligible for an exclusive 25% discount for the first three months. This limited-time offer is our way of thanking you for your continued trust in our services.</p>
      <p>To learn more about how this can transform your operations, simply reply to this email or book a time directly on my calendar: [Calendar Link]</p>
      <p>Don't miss out on this opportunity to elevate your business to the next level!</p>
      <p>Best,<br/>Your Name</p>
    `
  },
  {
    id: '4',
    subject: 'Quick Question About Your Current Solutions',
    body: `
      <p>Hello,</p>
      <p>I came across your company while researching industry leaders in your sector. Your recent achievements in digital transformation are truly impressive!</p>
      <p>I'm curious to know:</p>
      <ul>
        <li>How are you currently handling your workflow automation?</li>
        <li>What challenges are you facing with your existing tools?</li>
        <li>Are you exploring new solutions for Q1 2025?</li>
      </ul>
      <p>We've helped similar companies reduce manual processes by 60% while improving accuracy. I believe we could achieve similar results for your team.</p>
      <p>Would you be open to a brief 15-minute call to explore if there's a fit? I have availability this week on Wednesday and Friday afternoon.</p>
      <p>Thanks for your time!</p>
      <p>Cheers,<br/>Your Name</p>
    `
  },
  {
    id: '5',
    subject: 'Exclusive Invitation: Industry Webinar Next Week',
    body: `
      <p>Dear Professional,</p>
      <p>You're invited to join our exclusive webinar: <strong>"Future of Digital Partnerships in 2025"</strong></p>
      <p><strong>Event Details:</strong></p>
      <ul>
        <li>Date: Next Thursday, 2:00 PM EST</li>
        <li>Duration: 45 minutes + Q&A</li>
        <li>Format: Interactive online session</li>
      </ul>
      <p><strong>What You'll Learn:</strong></p>
      <ol>
        <li>Latest trends in partnership management</li>
        <li>Case studies from successful collaborations</li>
        <li>Tools and strategies for maximizing partnership ROI</li>
        <li>Exclusive networking opportunities with industry leaders</li>
      </ol>
      <p>Space is limited to ensure quality interaction. Reserve your spot now: [Registration Link]</p>
      <p>Can't make it? Register anyway and we'll send you the recording.</p>
      <p>See you there!<br/>Your Name</p>
    `
  }
]
