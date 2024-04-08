import React from 'react'
import { ImSpinner } from 'react-icons/im'
import { Progress } from "@/components/ui/progress"


function Loading() {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <ImSpinner className='animate-spin h-12 w-12' />
        </div>
    )
}

export default Loading