import Link from "next/link";
import logo from "/public/logo.svg";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="z-30 px-6 py-6 mb-20 border-b md:px-16 border-zinc-800 md:mb-28">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link
          href="/"
          className="">
          <Image src={logo} alt="logo" height={40}/>
        </Link>
        <nav>
          <ul
            className="flex items-center gap-x-8"
          >
            <li>
              <Link
                href="/about"
                className="duration-300 hover:text-purple-400"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="duration-300 hover:text-purple-400"
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
