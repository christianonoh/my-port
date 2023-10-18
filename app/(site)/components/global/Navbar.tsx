import Link from "next/link";
import logo from "../../icons/logo.webp"
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="py-6 md:px-16 px-6 border-b border-zinc-800 z-30 md:mb-28 mb-20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="p-1 bg-slate-50 rounded-lg">
          <Image src={logo} alt="logo" height={25}/>
        </Link>
        <nav>
          <ul
            className="flex items-center gap-x-8"
          >
            <li>
              <Link
                href="/about"
                className="hover:text-purple-400 duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-purple-400 duration-300"
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
