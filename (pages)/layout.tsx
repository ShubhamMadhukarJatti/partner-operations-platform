const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='container prose max-w-screen-xl py-4'>{children}</main>
  )
}

export default PagesLayout
