import type React from 'react'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router-dom'


// interface HeaderProps{
//     role : 'owner' | 'trainer' | 'member'
// }
const Header: React.FC = () => {
    const location = useLocation()

    const validRoles = ["owner", "trainer", "member"] as const;
    type Role = (typeof validRoles)[number];

    const pathnameRole = location.pathname.split("/")[1];
    const role: Role | null = validRoles.includes(pathnameRole as Role)
        ? (pathnameRole as Role)
        : null;



    let value: boolean = false


    return (
        <header className='w-full bg-white p-4 flex justify-between items-center border-b border-gray-100'>
            <h1 className='text-2xl font-bold'>BodyFirst</h1>

            <nav className='space-x-4'>
                {value ? (

                    <>

                        <Link to='/'>
                            <Button className='px-3 py-1  bg-[#6187F0] cursor-pointer'>Home</Button>
                        </Link>

                        <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer'>Logout</Button>
                    </>
                )
                    : (
                        <>
                            <Link to='/owner'>
                                <Button className='px-3 py-1  bg-[#6187F0] cursor-pointer'>Home</Button>
                            </Link>

                            <Link to={role ? `/${role}/signup` : "/owner/signup"}>
                                <Button className="px-3 py-1 bg-white text-black hover:bg-black hover:text-white cursor-pointer">
                                    Signup
                                </Button>
                            </Link>


                            <Link to={role ? `/${role}/login` : "/owner/login"}>
                                <Button className="px-3 py-1 bg-white text-black hover:bg-black hover:text-white cursor-pointer">
                                    Login
                                </Button>
                            </Link>

                            <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer'>About</Button>
                        </>

                    )}

            </nav>

        </header>
    )
}

export default Header