import Link from './Link'

const DEFAULT_HEADER_STYLES = {
  header: 'col-span-1 row-span-1 pb-20',
  h1: 'text-5xl lg:text-7xl tracking-tighter text-green-400 font-bold text-center md:text-right',
  p: 'text-3xl text-center md:text-right block',
  nav: 'md:inline-block md:float-right pt-6',
  ul: 'text-center md:text-right',
}

type HeaderProps = {
  styles?: {
    header?: string
    h1?: string
    p?: string
    nav?: string
    ul?: string
  }
}

export default function Header(props: HeaderProps) {
  const { styles = DEFAULT_HEADER_STYLES } = props
  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>
        <a className='link hover:link-hover' href='/'>
          s9tpepper.dev
        </a>
      </h1>
      <p className={styles.p}>
        <a href='/coding' title='Coding' className='hover:link-hover'>
          👨🏽‍💻
        </a>{' '}
        <a href='/gardening' title='Gardening' className='hover:link-hover'>
          👨🏽‍🌾
        </a>{' '}
        <a href='/bbq' title='BBQ' className='hover:link-hover'>
          🍖
        </a>{' '}
        <a href='/games' title='Games' className='hover:link-hover'>
          🎮
        </a>
      </p>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li>
            <Link href='/coding' label='coding' />
          </li>
          <li>
            <Link href='/gardening' label='gardening' />
          </li>
          <li>
            <Link href='/bbq' label='bbq' />
          </li>
          <li>
            <Link href='/games' label='games' />
          </li>
          <li>
            <Link href='/about' label='about' />
          </li>
        </ul>
      </nav>
    </header>
  )
}
