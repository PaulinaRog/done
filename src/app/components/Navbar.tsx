import Link from "next/link";
import Image from "next/image";
import NavbarUser from "./NavbarUser";

export default async function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full bg-nav-dark text-txt-dark shadow-soft h-14">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.svg"
                        alt=""
                        height={30}
                        width={80}
                        className="h-4 w-auto"
                    />
                </Link>
                <NavbarUser />
            </div>
        </nav>
    );
}
