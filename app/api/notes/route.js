import dbConnect from '../../../lib/db'
import Note from '../../../models/Note'
import { NextResponse } from 'next/server'


export async function GET(){
    try{
        await dbConnect()

        const notes = Note.find({}).sort({createdAt:-1})

        return NextResponse.json({data:notes})
    }

    catch(e){
        throw error(e)
    }
}

export async function POST(request,params) {
    try{
        await dbConnect()
        const body = await request.json()

        const note = await Note.create(body)

        return NextResponse.json({'message':'note created suscessfully','notes':note})

    }

    catch(e){
        throw error(e)
    }
}