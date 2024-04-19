import { Progress } from '@/components/ui/progress'
import React from 'react'
import { ImSpinner } from 'react-icons/im'

function Loading() {
    return (
        <div className='flex flex-col items-center justify-center w-full h-full'>
            <div className='w-4/12'>
                <Progress value={100} />
            </div>
        </div>
    )
}

export default Loading