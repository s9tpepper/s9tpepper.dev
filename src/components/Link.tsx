type LinkProps = {
  label: string
  href: string
  className?: string
}

export default function Link(props: LinkProps) {
  const { label, href, className = 'link' } = props
  return (
    <a href={href} className={`${className} hover:link-hover`}>
      {label}
    </a>
  )
}
