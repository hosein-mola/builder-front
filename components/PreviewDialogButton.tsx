import React from 'react'
import { Button } from './ui/button'

import { MdPreview } from 'react-icons/md';
import useDesigner from './hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElement';

const PreviewDialogButton = () => {
    const { elements } = useDesigner();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} className='gap-2'>
                    <MdPreview className='h-6 w-6' />
                    Preview
                </Button>
            </DialogTrigger>
            <DialogContent className=' w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
                <div className='px-4 py-2 border-b'>
                    <p className='text-lg font-bold text-muted-foreground'>
                        Form Preview
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        this is will look liek to your users
                    </p>
                </div>
                <div className=' bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto'>
                    <div className='bg-background   h-full max-w-[960px] w-full p-2  overflow-y-auto'>
                        {elements.filter(_element => _element.parentId == null).map(element => {
                            const FormComponent = FormElements[element.type].formComponent;
                            return <FormComponent key={element.id} elementInstance={element} />
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewDialogButton