"use client"
import React, { useEffect, useState } from 'react'
import { ElementType, FormElement, FormElementInstance, FormElements, SubmitFunction } from '../FormElement'
import { MdTextFields } from 'react-icons/md';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { boolean, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VscLayoutSidebarRightOff } from "react-icons/vsc";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import { Switch } from '../ui/switch';
import useDesigner from '../hooks/useDesigner';
import { cn } from '@/lib/utils';
import { LuHeading1 } from 'react-icons/lu';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import Designer, { DesignerElementWrapper } from '../Designer';
import { ulid } from 'ulid';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const type: ElementType = "panel";

const extraAttributes = {
    id: '',
    title: "title field",
    state: [],
    cols: "4",
    span: '1',
    padding: '0.5',
    paddingUnit: 'rem',
    gap: '0'
}

const propertiesSchema = z.record(z.string(), z.string().optional());

export const PanelFieldElement: FormElement = {
    type,
    construct: (id: string, index: number, parentId: string | null, page: number, _extraAttributes?: Record<string, any>) => {
        return ({
            id,
            index,
            type,
            parentId,
            page,
            extraAttributes: {
                ...extraAttributes,
                ..._extraAttributes,
            }
        })
    },
    designerBtnElement: {
        icon: VscLayoutSidebarRightOff,
        label: 'Panel field'
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { addElement, selectedElement, setSelectedElement, elements } = useDesigner();
    const droppble = useDroppable({
        id: elementInstance.id + '-panel',
        data: {
            type: "panel",
            extraAttributes: {
                id: elementInstance.id,
            }
        }
    });

    const cols = 3;
    const element = elementInstance as CustomInstance;
    return <div
        dir='rtl'
        ref={droppble.setNodeRef}
        className={cn('flex flex-col bg-background h-full flex-grow w-full cursor-default',
        )}
    >
        <div className={cn(' grid grid-cols-2  border p-5 gap-y-1 gap-x-1 grow  min-h-[5rem] h-full ',
            String(element.extraAttributes.cols) == "1" && "grid-cols-1",
            String(element.extraAttributes.cols) == "2" && "grid-cols-2",
            String(element.extraAttributes.cols) == "3" && "grid-cols-3",
            String(element.extraAttributes.cols) == "4" && "grid-cols-4",
            String(element.extraAttributes.cols) == "5" && "grid-cols-5",
            String(element.extraAttributes.cols) == "6" && "grid-cols-6",
            String(element.extraAttributes.cols) == "7" && "grid-cols-7",
            String(element.extraAttributes.cols) == "8" && "grid-cols-8",
            String(element.extraAttributes.cols) == "9" && "grid-cols-9",
            String(element.extraAttributes.cols) == "10" && "grid-cols-10",
            String(element.extraAttributes.cols) == "11" && "grid-cols-11",
            String(element.extraAttributes.cols) == "12" && "grid-cols-12",
        )}
            style={{
                ...element.extraAttributes,
                gap: element.extraAttributes['gap'] + 'rem',
                padding: element.extraAttributes['padding'] + element.extraAttributes['paddingUnit']
            }}
        >
            {elements.filter(el => el.parentId == element.id).sort((a: FormElementInstance, b: FormElementInstance) => a.index - b.index).map((element, index) => {
                return <div
                    className={cn('h-full grow grid w-full ',
                        String(element.extraAttributes.span) == "1" && "col-span-1",
                        String(element.extraAttributes.span) == "2" && "col-span-2",
                        String(element.extraAttributes.span) == "3" && "col-span-3",
                        String(element.extraAttributes.span) == "4" && "col-span-4",
                        String(element.extraAttributes.span) == "5" && "col-span-5",
                        String(element.extraAttributes.span) == "6" && "col-span-6",
                        String(element.extraAttributes.span) == "7" && "col-span-7",
                        String(element.extraAttributes.span) == "8" && "col-span-8",
                        String(element.extraAttributes.span) == "9" && "col-span-9",
                        String(element.extraAttributes.span) == "10" && "col-span-10",
                        String(element.extraAttributes.span) == "11" && "col-span-11",
                        String(element.extraAttributes.span) == "12" && "col-span-12",
                        String(element.extraAttributes.span) == "full" && "col-span-full",
                    )}
                    key={element.id}
                >
                    <DesignerElementWrapper element={element} index={index} row={true} />
                </div>
            })}
        </div>
    </div >
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
    isInvalid?: boolean,
    submitValue?: SubmitFunction,
    defaultValue?: string
}) {
    const element = elementInstance as CustomInstance;
    const { title } = element.extraAttributes;
    return <p className='text-xl'>{title}</p>
}

function PropertiesComponent({
    elementInstance
}: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;

    const form = useForm<propertiesFormSchemaType>({
        mode: "all",
        defaultValues: {
            title: element.extraAttributes.title,
        }
    });

    useEffect(() => {
        // form.reset(element.extraAttributes);
    }, [element, form])

    function applyChanges(values: any) {
        updateElement(element.id, {
            ...element,
            extraAttributes: { ...values }
        });
    }
    return <Form {...form}>
        <form onSubmit={(e) => {
            e.preventDefault();
        }} onChange={form.handleSubmit(applyChanges)} className='flex flex-col space-y-3 gap-2'>
            <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className=''>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Info</AccordionTrigger>
                    <AccordionContent data-state={'open'}>
                        <FormField control={form.control} name={'title'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel>test</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onKeyDown={(e) => {
                                            if (e.key == 'Enter') e.currentTarget.blur();
                                        }} />
                                </FormControl>
                                <FormDescription>
                                    id: {element.id}
                                </FormDescription>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>;
                        }} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className='flex flex-col gap-2'>
                    <AccordionTrigger>Layout</AccordionTrigger>
                    <AccordionContent className=''>
                        <div className='grid grid-cols-3 gap-4'>
                            <FormField control={form.control} name={'cols'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Cols</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                            <FormField control={form.control} name={'span'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Span</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                            <FormField control={form.control} name={'gap'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Gap</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                        </div>
                        <div className='mt-2 flex flex-row gap-1 p-1'>
                            <FormField control={form.control} name={'padding'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className='font-bold'>Padding</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            className='rounded-none'
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key == 'Enter') e.currentTarget.blur();
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                            <FormField control={form.control} name={'paddingUnit'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className='font-bold'>Unit</FormLabel>
                                    <Select {...field} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rem">rem</SelectItem>
                                            <SelectItem value="%">precent</SelectItem>
                                            <SelectItem value="px">pixel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </form>
    </Form>
}

