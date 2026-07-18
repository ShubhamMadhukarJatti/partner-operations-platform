import { CollaborationType, OrganizationType } from '@/types'

type Props = {
  sender: OrganizationType
  reciever: OrganizationType
  proposal: CollaborationType
}
export const Mou = ({ sender, reciever, proposal }: Props) => {
  const date = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const startDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const end = new Date()
  end.setMonth(end.getMonth() + 3)
  const endDate = end.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const offers =
    proposal.partnershipMouVersions.length > 0
      ? proposal.partnershipMouVersions[
          proposal.partnershipMouVersions.length - 1
        ].receiverBenefits.map((offer) => {
          return {
            offer: offer.benefit,
            description: offer.description
          }
        })
      : []

  const expectations =
    proposal.partnershipMouVersions.length > 0
      ? proposal.partnershipMouVersions[
          proposal.partnershipMouVersions.length - 1
        ].senderBenefits.map((expectation) => {
          return {
            offer: expectation.benefit,
            description: expectation.description
          }
        })
      : []

  return (
    <div className='prose max-w-none prose-headings:mt-0'>
      <h1 className='text-xl font-semibold'>
        MEMORANDUM OF UNDERSTANDING (MOU)
      </h1>
      <p className=''>
        This Memorandum of Understanding (MOU) is made and entered into on the{' '}
        {date} , by and between {sender.name} and {reciever.name}
      </p>
      <h2>Purpose and Scope</h2>
      <p>
        The purpose of this MOU is to partner {sender.name} , {sender.stage} ,{' '}
        {sender.briefDescription} , {sender.address} with {reciever.name} ,{' '}
        {reciever.stage} , {reciever.briefDescription} , {reciever.address} by
        sharing resources as mentioned in this document for mutual growth.
      </p>
      <h2>Responsibilities</h2>
      {sender.name} responsibilities include
      <ul>
        {offers.map((offer: { offer: string; description: string }) => (
          <li key={offer.offer}>
            {offer.offer}
            <p className='mt-0'>{offer.description}</p>
          </li>
        ))}
      </ul>
      {reciever.name} responsibilities include
      <ul>
        {expectations.map(
          (expectation: { offer: string; description: string }) => (
            <li key={expectation.offer}>
              {expectation.offer}
              <p className='mt-0'>{expectation.description}</p>
            </li>
          )
        )}
      </ul>
      <h2>Timeline</h2>
      <p>
        This MOU is effective for three months, starting from {startDate} to{' '}
        {endDate}.
      </p>
      <h2>Communication</h2>
      <p>
        email for {sender.name} is {sender.primaryEmail} , email for{' '}
        {reciever.name} is {reciever.primaryEmail} no unsecured embedded link
        should be provided by either startups for security reasons
      </p>
      <h2>Confidentiality</h2>
      <p>
        The information regarding this agreement will not be shared outside of
        the Sharkdom team and among members of either startups.
      </p>
      <h2>Governing Law</h2>
      <p>
        Any disputes arising from or related to this MOU shall be resolved by
        law in case the Mediator which in this case is {'SharkDom'} is unable to
        resolve the issue as agreed by both parties.
      </p>
      <p>
        This MOU contains the entire understanding of the parties and supersedes
        all prior negotiations, understandings, and agreements between them,
        whether oral or written before the initiation of the partnership inside
        the platform. This MOU may only be modified in writing and signed by
        both parties.
      </p>
    </div>
  )
}
