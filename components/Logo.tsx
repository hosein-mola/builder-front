import Link from 'next/link'
import React from 'react'
function Logo() {
    return (
        <Link href={'/'} className='bg-gradient-to-r gap-4 items-center flex flex-row text-3xl font-bold from-red-600  to-red-300  text-transparent bg-clip-text'>
            <span className='text-black dark:text-white '>Form Studio</span>
            <img src={'/logo.svg'} className='w-12 h-12' />
        </Link>
    )
}

export default Logo