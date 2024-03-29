"use client"
import React, { startTransition, useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from './FormElement'
import { Button } from './ui/button'
import { HiCursorClick } from 'react-icons/hi'
import { toast } from './ui/use-toast'
import { ulid } from 'ulid'
import { ImSpinner } from 'react-icons/im'
import { SubmitForm } from '@/actions/form'

function FormSubmitComponent({
    formUrl,
    content
}: {
    formUrl: string,
    content: FormElementInstance[]
}) {
    const formValues = useRef<{ [key: string]: string }>({});
    const formErrors = useRef<{ [key: string]: boolean }>({});
    const [renderkey, setRenderKey] = useState(ulid(10));
    const [submitted, setSubmitted] = useState(false);
    const [pending, transition] = useTransition();

    const submitValue = useCallback((key: string, value: string) => {
        formValues.current[key] = value;
    }, [])

    const validateForm: () => boolean = useCallback(() => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue);
            if (!valid) {
                formErrors.current[field.id] = true;
            }
        }
        if (Object.keys(formErrors.current).length > 0) {
            return false;
        }
        return true;
    }, [content])

    const submitForm = async () => {
        formErrors.current = {};
        const validForm = validateForm();
        if (!validForm) {
            setRenderKey(ulid(10));
            toast({
                title: "invalid",
                description: "the form is invalid",
                variant: "destructive"
            });
            return;
        }
        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl, jsonContent);
            setSubmitted(true);
        } catch (error) {
            toast({
                title: "invalid",
                description: "something went wrong",
                variant: "destructive"
            });
        }
    }
    if (submitted) {
        return (
            <div className="flex justify-center w-full h-full items-center p-8">
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
                    <h1 className="text-2xl font-bold">Form submitted</h1>
                    <p className="text-muted-foreground">Thank you for submitting the form, you can close this page now.</p>
                </div>
            </div>
        );
    }
    return (
        <div className='flex justify-center items-center p-8 w-full h-full'>
            <div key={renderkey} className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background  w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
                {content.map(element => {
                    const FormElement = FormElements[element.type].formComponent;
                    return <FormElement
                        key={element.id}
                        isInvalid={formErrors.current[element.id]}
                        elementInstance={element}
                        submitValue={submitValue}
                        defaultValue={formValues.current[element.id]}
                    />
                })}
                <Button disabled={pending} className='mt-8' onClick={() => {
                    startTransition(submitForm as any);
                }}>
                    {!pending && <div>
                        <HiCursorClick className='mr-2' />
                        Submit
                    </div>}
                    {pending && <ImSpinner className='animate-spin' />}
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent