import {
  BrainCircuit,
  DraftingCompass,
  FileCheck,
  FileText,
  LineChart,
  ShieldCheck,
  TextCursorInput,
  User
} from 'lucide-react'

const features = [
  {
    name: 'Create & Share MOUs',
    description:
      'Generate MOUs and share them with your partners. You can also create templates to reuse them for future collaborations.',
    icon: FileText
  },
  {
    name: 'Collab Bridge',
    description:
      'Dedicated portal for startups to draft their partnership proposals including resources for best practices.',
    icon: FileCheck
  },
  {
    name: 'Collabora Form',
    description:
      'share feedback forms to your partnered communities to gain access to untapped market giving more scope of expansion at hyper growth.',
    icon: TextCursorInput
  },
  {
    name: "Sign and maintain versions of MOU's",
    description:
      'Manage terms of your partnerships midway using our easy to use inbuilt doc signer valid both inside and outside our platform',
    icon: ShieldCheck
  },
  {
    name: 'Partnership Liason',
    description:
      'Get our specially trained AI bot to act as the partnership manager for your startup.',
    icon: BrainCircuit
  },
  {
    name: 'Collaborative tools',
    description:
      'Get access to our collaborative tools to verify authenticity of shared links, resources, success rate of your partnership proposals and more.',
    icon: DraftingCompass
  },
  {
    name: 'Performance Tracking',
    description:
      'Get realtime performance insights of all your feedback forms or polls right in your dashboard.',
    icon: LineChart
  },
  {
    name: 'Alliance Manager',
    description:
      'Get a dedicated alliance manager to resolve dispute with your partner on your behalf',
    note: 'This feature is available only for elite plan users, Contact support for more info.',
    icon: User
  }
]
export const Features = () => {
  return (
    <div className='mx-auto flex max-w-7xl flex-col gap-12 px-6 py-24 lg:px-8'>
      <div className='mx-auto flex max-w-2xl flex-col gap-1 lg:text-center'>
        <p className='text-base font-semibold text-indigo-600'>
          Scale faster with sharkdom
        </p>

        <h2 className='text-3xl font-semibold'>
          One stop solution for partnerships
        </h2>
        <p className='text-lg text-muted-foreground'>
          Virtual Relationship Manager for your Startups
        </p>
      </div>
      <div className='mx-auto'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-y-16'>
          {features.map((feature) => (
            <div key={feature.name} className='relative pl-16'>
              <dt className='text-base font-semibold leading-7 text-gray-900'>
                <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                  <feature.icon
                    className='h-6 w-6 text-white'
                    aria-hidden='true'
                  />
                </div>
                {feature.name}
              </dt>
              <dd className='mt-2 text-base leading-7 text-gray-600'>
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
