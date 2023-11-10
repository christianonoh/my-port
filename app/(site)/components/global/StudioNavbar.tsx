import { IoChevronBackOutline } from 'react-icons/io5'
import Link from "next/link"

const StudioNavbar = (props: any) => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2 p-4 text-base text-[#dcbbea]" >
          <IoChevronBackOutline className="w-4 h-4 text-2xl"/>
          Back to Website
      </Link>
      <>{props.renderDefault(props)}</>
    </div>
  )
}

export default StudioNavbar;
