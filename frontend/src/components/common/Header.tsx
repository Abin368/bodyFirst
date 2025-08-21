import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
const Header = () => {

    // const {isLoggedIn , username , logout} = useUser()
   let value:boolean = false

  return (
    <header className='w-full bg-white p-4 flex justify-between items-center border-b border-gray-100'>
        <h1 className='text-2xl font-bold'>BodyFirst</h1>

        <nav className='space-x-4'>
            {value ?(

                <>

                <Link to='/'>
                       <Button className='px-3 py-1  bg-[#6187F0] cursor-pointer'>Home</Button>
                 </Link>
             
                 <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer'>Logout</Button>
                </>
            )
            :(
                <>
           <Link to='/'>
                       <Button className='px-3 py-1  bg-[#6187F0] cursor-pointer'>Home</Button>
                 </Link>
             
            <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer' >Signup</Button>
            <Link to='/login'>
                <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer'>Login</Button>
            </Link>
            
            <Button className='px-3 py-1  bg-white text-black hover:bg-black hover:text-white cursor-pointer'>About</Button>
                </>
       
            )}
           
        </nav>

    </header>
  )
}

export default Header