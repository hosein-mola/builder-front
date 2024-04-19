import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
function Logo(props: any) {
    return (
        <Link href={'/'} className={cn('bg-gradient-to-r gap-4 items-center flex flex-row text-3xl font-bold from-red-600  to-red-300  text-transparent bg-clip-text', "")}>
            {!props.noText && <span className='text-black dark:text-white '>Form Studio</span>}
            <img src={'/logo.svg'} className={cn('w-12 h-12', props.className)} />
        </Link>
    )
}

export default Logo