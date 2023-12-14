import Image from "next/image"
import Favicon from '@/public/logo.svg'

const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      <Image
        src={Favicon}
        alt="Logo"
        className="object-cover"
        width={40}
        height={40}
      />
      Studio
    </div>
  )
}

export default Logo
