
"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const nav_links = [
    { title: "Dashboard", link: "/" },
    { title: "Search", link: "/search" },
    { title: "Voice", link: "/voice" },
    { title: "Threats Log", link: "/threat-log"}
];

export default function Navbar() {

    const pathname = usePathname();
    console.log(pathname)
    return (
        <header>
            <div className="flex items-center justify-between h-12 p-7">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <div className={"flex items-center gap-0.5 text-2xl font-bold"}>
                            <span className="text-purple-500">Watch</span>
                            <span className="text-purple-700">Dog</span>
                        </div>
                    </Link>
                </div>
                <nav className="hidden md:block">
                    <ul className="flex space-x-4">
                        {nav_links.map((nav, index) => {
                            const isActive = pathname === nav.link;
                            return (
                                 <li key={index}>
                                     <Link
                                         href={nav.link}
                                         className={cn("px-3 py-1.5 rounded-md text-md font-medium hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out",
                                         isActive && "bg-gray-700 text-white"
                                         )}
                                     >
                                         {nav.title}
                                     </Link>
                                 </li>
                             )
                        })}
                    </ul>
                </nav>
                <div className="md:hidden">
                    <button className="mobile-menu-button p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}