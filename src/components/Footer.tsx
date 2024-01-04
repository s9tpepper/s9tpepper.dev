export default function Footer() {
  const styles = {
    width: '100vw',
    margin: '0 0 0 -50vw',
    left: '50%',
    position: 'relative',
  }
  return (
    <footer className='footer bg-gray-900 text-white pl-10 pr-10 h-[80px] leading-[80px]'>
      &copy; {new Date().getFullYear()} s9tpepper.dev
    </footer>
  )
}
