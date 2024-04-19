"use client"
import React, { useEffect, useState } from 'react'
import { ElementType, FormElement, FormElementInstance, FormElements, SubmitFunction } from '../FormElement'
import { MdTextFields } from 'react-icons/md';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { boolean, z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
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

const type: ElementType = "flex";

const extraAttributes = {
    id: '',
    title: "title field",
    flex: 1,
    minHeight: '5',
    alignSelf: 'stretch',
    flexWrap: 'no-wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    state: [],
    border: '0.05rem solid #d0d0d0',
    padding: '0.5',
    paddingUnit: 'rem',
    gap: '0'
}

const propertiesSchema = z.record(z.string(), z.string().optional());

export const FlexFieldElement: FormElement = {
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
        label: 'Flex field'
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
    const { elements } = useDesigner();
    const droppble = useDroppable({
        id: elementInstance.id + '-flex',
        data: {
            type: "flex",
            extraAttributes: {
                id: elementInstance.id,
            }
        }
    });

    const element = elementInstance as CustomInstance;

    return <div
        dir='rtl'
        ref={droppble.setNodeRef}
        className={cn('flex')}
        style={{
            ...elementInstance.extraAttributes,
            gap: elementInstance.extraAttributes['gap'] + 'rem',
            minHeight: elementInstance.extraAttributes['minHeight'] + 'rem',
            padding: elementInstance.extraAttributes['padding'] + elementInstance.extraAttributes['paddingUnit']
        }}
    >
        {elements.filter(el => el.parentId == element.id).sort((a: FormElementInstance, b: FormElementInstance) => a.index - b.index).map((_element, index) => {
            return <DesignerElementWrapper element={_element} index={index} row={element.extraAttributes['flexDirection'] == 'row' ? true : false} />
        })}
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

    const form = useForm<any>({
        mode: "all",
        defaultValues: {
            ...element.extraAttributes
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form, element.extraAttributes])

    const formData = useWatch({ control: form.control });

    React.useEffect(() => {
        formData.id = element.id;
        applyChanges(formData);
    }, [formData]);

    function applyChanges(values: any) {
        values.id = element.id;
        console.log(values);

        updateElement(element.id, {
            ...element,
            extraAttributes: { ...values }
        });
    }

    return <Form {...form}>
        <form className='flex flex-col space-y-3 gap-2'>
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
                            <FormField control={form.control} name={'gap'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Gap</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                        </div>
                        <div className='grid grid-cols-3 gap-4'>
                            <FormField control={form.control} name={'minHeight'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>minHeight</FormLabel>
                                    <FormControl>
                                        <Input
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                        </div>
                        <div className='grid grid-cols-3 gap-4'>
                            <FormField control={form.control} name={'minHeight'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>minHeight</FormLabel>
                                    <FormControl>
                                        <Input
                                            onChange={field.onChange}
                                            value={field.value}
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
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>;
                            }} />
                            <FormField control={form.control} name={'paddingUnit'} render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className='font-bold'>Unit</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
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
                        <FormField control={form.control} name={'flexDirection'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>direction</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="column">col</SelectItem>
                                        <SelectItem value="row">row</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'flexWrap'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>flexWrap</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no-wrap">no wrap</SelectItem>
                                        <SelectItem value="wrap">wrap</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'justifyContent'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>justifyContent</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="flex-start">start</SelectItem>
                                        <SelectItem value="flex-end">end</SelectItem>
                                        <SelectItem value="center">center</SelectItem>
                                        <SelectItem value="space-around">space-around</SelectItem>
                                        <SelectItem value="space-between">space-between</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'alignItems'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>alignItems</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="alignItems" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="flex-start">start</SelectItem>
                                        <SelectItem value="flex-end">end</SelectItem>
                                        <SelectItem value="center">center</SelectItem>
                                        <SelectItem value="stretch">stretch</SelectItem>
                                        <SelectItem value="baseline">baseline</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'alignContent'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>alignContent</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="flex-start">start</SelectItem>
                                        <SelectItem value="flex-end">end</SelectItem>
                                        <SelectItem value="center">center</SelectItem>
                                        <SelectItem value="stretch">stretch</SelectItem>
                                        <SelectItem value="baseline">baseline</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'flexGrow'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>grow</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">grow</SelectItem>
                                        <SelectItem value="0">not-grow</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                        <FormField control={form.control} name={'alignSelf'} render={({ field }) => {
                            return <FormItem>
                                <FormLabel className='font-bold'>alignSelf</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="alignSelf" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">start</SelectItem>
                                        <SelectItem value="flex-start">start</SelectItem>
                                        <SelectItem value="flex-end">end</SelectItem>
                                        <SelectItem value="center">center</SelectItem>
                                        <SelectItem value="stretch">stretch</SelectItem>
                                        <SelectItem value="baseline">baseline</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>;
                        }} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </form>
    </Form>
}

