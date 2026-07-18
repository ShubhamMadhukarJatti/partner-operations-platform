import Script from 'next/script'

const NewAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      {children}
    </main>
  )
}

export default NewAuthLayout
