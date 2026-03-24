import dbConnect from '../../../lib/db'
import Note from '../../../models/Note'
import { NextResponse } from 'next/server'

function validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return 'Invalid request body TEST GIT COMMIT'
    }

    const title = typeof payload.title === 'string' ? payload.title.trim() : ''
    const content = typeof payload.content === 'string' ? payload.content.trim() : ''

    if (!title) {
        return 'Title is required'
    }

    if (!content) {
        return 'Content is required'
    }

    return null
}

export async function GET() {
    try {
        await dbConnect()
        const notes = await Note.find({}).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ notes })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to fetch notes', error: e.message },
            { status: 500 },
        )
    }
}

export async function POST(request) {
    try {
        await dbConnect()
        const body = await request.json()
        const validationError = validatePayload(body)

        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 })
        }

        const note = await Note.create({
            title: body.title.trim(),
            content: body.content.trim(),
        })

        return NextResponse.json(
            { message: 'Note created successfully', note },
            { status: 201 },
        )
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to create note', error: e.message },
            { status: 500 },
        )
    }
}

export async function PUT(request) {
    try {
        await dbConnect()
        const body = await request.json()
        const validationError = validatePayload(body)

        if (!body?.id) {
            return NextResponse.json({ message: 'Note id is required' }, { status: 400 })
        }

        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 })
        }

        const note = await Note.findByIdAndUpdate(
            body.id,
            {
                title: body.title.trim(),
                content: body.content.trim(),
            },
            { new: true, runValidators: true },
        )

        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Note updated successfully', note })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to update note', error: e.message },
            { status: 500 },
        )
    }
}

export async function DELETE(request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Note id is required' }, { status: 400 })
        }

        const deleted = await Note.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Note deleted successfully' })
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to delete note', error: e.message },
            { status: 500 },
        )
    }
}