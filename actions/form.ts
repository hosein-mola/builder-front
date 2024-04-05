import { FormElementInstance } from './../components/FormElement';
"use server"

import api from '@/api/apiConfig';
import prisma from '@/lib/prisma'
import { formSchemaType, formSchemea } from '@/schemas/form';
import { userAgent } from 'next/server';
const user = {
    id: '1',
    username: 'test',
    email: 'test@mail.com',
    name: 'test',
};
export async function GetFormStats() {
    const data = await api.v1.get('/forms/stats');

    const {
        visits, submissions, submissionsRate, bounceRate
    } = data.data.collection;

    return {
        visits, submissions, submissionsRate, bounceRate
    }
}

export async function CreateForm(data: formSchemaType) {
    const model = {
        name: data.name,
        description: data.description
    }
    const response = await api.v1.post('/forms', { ...model });
    return response.data.collection.id
}

export async function GetForms() {
    const response = await api.v1.get('/forms');
    const { collection } = response.data;
    return collection.forms;
}

export async function GetFormById(id: number) {
    try {

        const response = await api.v1.get(`/forms/${id}`);
        const { collection } = response.data;
        return collection.form;
    } catch (error) {
    }

}

export async function UpdateFormContent(id: number, componenets: FormElementInstance[]) {
    const response = await api.v1.put(`/forms/${String(id)}`, componenets, { method: 'PUT' });
}

export async function PublishForm(formId: number) {
    return await prisma.form.update({
        where: {
            userId: user.id,
            id: Number(formId)
        },
        data: {
            published: true
        }
    })
}

export async function GetFormContentByUrl(formUrl: string) {

    return await prisma.form.update({
        select: {
            context: true
        },
        data: {
            visit: {
                increment: 1
            }
        },
        where: {
            sharedURL: formUrl
        }
    })
}

export async function SubmitForm(formUrl: string, content: string) {
    return await prisma.form.update({
        data: {
            submission: {
                increment: 1
            },
            FormSubmission: {
                create: {
                    content: content
                }
            }
        },
        where: {
            userId: user.id,
            sharedURL: formUrl,
            published: true,
        }
    })
}

export async function GetFormWithSubmissions(id: number) {
    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id,
        },
        include: {
            FormSubmission: true,
        },
    });
}