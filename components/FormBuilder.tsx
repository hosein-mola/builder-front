"use client"
import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import PreviewDialogButton from './PreviewDialogButton'
import PublishFormButton from './PublishFormButton'
import SaveFormButton from './SaveFormButton'
import Designer from './Designer'
import { DndContext, MouseSensor, PointerSensor, TouchSensor, closestCenter, closestCorners, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'
import useDesigner from './hooks/useDesigner'
import { FaSpinner } from 'react-icons/fa'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import Link from 'next/link'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Confetti from 'react-confetti';
import { cn } from '@/lib/utils'
import { LuLocateFixed, LuUserCircle } from 'react-icons/lu'
import { GoGrabber } from 'react-icons/go'
import { LiaElementor } from "react-icons/lia";
import { VscBroadcast, VscCombine, VscDatabase, VscHistory, VscInsert, VscJson, VscLayers, VscLayout, VscListTree, VscOrganization, VscSettings, VscThreeBars, VscWorkspaceTrusted } from 'react-icons/vsc'
import { Progress } from './ui/progress'
import Logo from './Logo'
import { GetFormById } from '@/actions/form'
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'

function FormBuilder(props: any) {
    const { selectedElement, selectedElementParents, setElements, setPages, setSelectedElement, updateSelectedParents } = useDesigner();
    const [isReady, setIsReady] = useState(false);
    const params = useParams();
    const [form, setForm] = useState(props.form);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 0,
            delay: 30,
            tolerance: 0
        },
    });

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 0,
            delay: 30,
            tolerance: 0
        }
    });

    // const touchSensor = useSensor(TouchSensor, {
    //     activationConstraint: {
    //         delay: 100,
    //         tolerance: 5
    //     }
    // });

    const sensors = useSensors(pointerSensor, mouseSensor);

    useEffect(() => {
        const req = async () => {
            const _form = await GetFormById(Number(params.id));
            setForm(_form);
            setElements(((_form as any).components));
            console.log("🚀 ~ useEffect ~ _form:", _form)
            setPages(JSON.parse((_form as any).page.extraAttributes));
            setIsReady(true);
        }
        req();
    }, [])
    useEffect(() => {
        if (isReady) return;

    }, [form, setElements])

    if (!isReady) {
        return <div className='flex flex-col items-center justify-center w-full h-full'>
            <div className='w-2/12 flex flex-col justify-center items-center gap-5'>
                <Logo noText className="w-32 h-32" />
                <Progress value={50} className='h-3' />
            </div>
        </div>
    }

    const shareUrl = `${window.location.origin}/submit/${form.sharedURL}`;

    if (form.published) {
        return (
            <>
                <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="max-w-xl">
                        <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                            🎊🎊 Form Published 🎊🎊
                        </h1>
                        <h2 className="text-2xl">Share this form</h2>
                        <h3 className="text-xl text-muted-foreground border-b pb-10">
                            Anyone with the link can view and submit the form
                        </h3>
                        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                            <Input className="w-full" readOnly value={shareUrl} />
                            <Button
                                className="mt-2 w-full"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: "Copied!",
                                        description: "Link copied to clipboard",
                                    });
                                }}
                            >
                                Copy link
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"link"} asChild>
                                <Link href={"/"} className="gap-2">
                                    <BsArrowLeft />
                                    Go back home
                                </Link>
                            </Button>
                            <Button variant={"link"} asChild>
                                <Link href={`/forms/${form.id}`} className="gap-2">
                                    Form details
                                    <BsArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={pointerWithin} >
            <main className="flex flex-col w-full">
                <nav className="flex justify-between border-b border-border p-4 gap-3 items-center">
                    <div className="flex items-center gap-2">
                        {!form.published && (
                            <>
                                <PublishFormButton id={form.id} />
                                <SaveFormButton id={form.id} />
                            </>
                        )}
                        <PreviewDialogButton />
                    </div>

                    <h2 dir='rtl' className="truncate font-medium">
                        <span dir='rtl' className="text-muted-foreground mr-2 font-bold">فرم:</span>
                        <span> {form.name}</span>
                    </h2>
                </nav>
                <div className="flex w-full flex-grow items-center justify-center relative overflow-y-hidden h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <div className='w-12 h-full flex flex-grow bg-background justify-between flex-col items-center gap-10 p-4 border-r'>
                        <div className='flex flex-col gap-10'>
                            <VscInsert className='w-6 h-6 cursor-pointer' />
                            <VscListTree className='w-6 h-6 cursor-pointer' />
                            <VscDatabase className='w-6 h-6 cursor-pointer' />
                            <VscHistory className='w-6 h-6 cursor-pointer' />
                            <VscCombine className='w-6 h-6 cursor-pointer' />
                            <VscJson className='w-6 h-6 cursor-pointer' />
                            <VscBroadcast className='w-6 h-6 cursor-pointer' />
                        </div>
                        <VscSettings className='w-6 h-6 cursor-pointer' />
                    </div>
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    )
}

export default FormBuilder