export default function FourOhFour() {
  return (
    <main className='h-full grid grid-flow-col gap-10 justify-center content-center'>
      <a href='/' title='Home'>
        <img
          className='h-60 border-green-400 border-solid border-r pr-10'
          src='/s9tpepper.svg'
          alt='s9tpepper logo'
        />
      </a>
      <p className='text-center grid content-center'>
        Sorry, could not find the page you were looking for.
      </p>
    </main>
  )
}
