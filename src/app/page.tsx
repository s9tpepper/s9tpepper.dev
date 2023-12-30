import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Link from '@/components/Link'

export default function Home() {
  return (
    <>
      <div className='grid grid-flow-col justify-center content-center h-40'>
        <img
          width='80px'
          height='80px'
          src='/s9tpepper_smaller.svg'
          alt='s9tpepper logo'
        />
      </div>
      <main className='grid grid-flow-col md:gap-16 min-h-[calc(100vh-240px)] grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1'>
        <Header />

        <p className='col-span-1 row-span-1 p-10 pt-0 md:pb-24 md:pr-24'>
          Hello! I am a full-stack software engineer from Long Beach, CA. I
          enjoy working on all the moving parts of a software project. I also do
          some vegetable gardening in my spare time, as well as BBQ&apos;ing.
          Mainly Texas style smoking - brisket, brisket, brisket! When I&apos;m
          not out in the backyard smoking or gardening I also enjoy a good video
          game. <br />{' '}
          {<Link href='/about' label='Read more' className='link text-xs' />}
        </p>
      </main>
      <Footer />
    </>
  )
}
