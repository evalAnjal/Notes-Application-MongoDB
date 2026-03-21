'use client'
import React, { useState } from 'react'

function NotesClient() {
    const [title,setTitle]= useState('')
    const [conetent,setContent]= useState('')
    const [loading,setLoading] = useState(false)
  return (
    <div className='space-y-6'>
        <form action="" className="bg-white rounded-lg shadow-md">
            <h1 className='text-xl font-semibold text-gray-800'>Create New Note</h1>
            <div className="space-y-4">
                <input placeholder='title' type="text" name="" id="" className='w-full p-3 border-black-300 rounded-md focus:outline-none focus:ring-blue-500 border-black'/>
            </div>
        </form>
    </div>
  )
}

export default NotesClient