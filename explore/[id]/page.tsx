import ExploreBetaClient from '../../explore-beta/[id]/_components/ExploreBetaClient'

type Props = {
  params: {
    id: string
  }
}

export default function ExplorePage({ params }: Props) {
  return <ExploreBetaClient id={params.id} />
}
