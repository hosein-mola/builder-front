import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen bg-background min-w-full max-h-screen'>
            <nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
                <div className='flex gap-4 items-center'>
                    <ThemeSwitcher />
                </div>
                <Logo />
            </nav>
            <main className='flex w-full flex-grow'>{children}</main>
        </div>
    )
}

export default layout