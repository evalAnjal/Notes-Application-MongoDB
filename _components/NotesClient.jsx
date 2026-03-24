'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

function NotesClient({ initialNotes = [] }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState(initialNotes)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')

  const submitLabel = useMemo(
    () => (editingId ? 'Update note' : 'Add note'),
    [editingId],
  )

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/notes', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to fetch notes')
      }

      setNotes(data.notes || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [])

  function resetForm() {
    setTitle('')
    setContent('')
    setEditingId('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Please add both a title and content')
      return
    }

    setSaving(true)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId
        ? { id: editingId, title, content }
        : { title, content }

      const response = await fetch('/api/notes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to save note')
      }

      resetForm()
      await fetchNotes()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setError('')

    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete note')
      }

      if (editingId === id) {
        resetForm()
      }

      await fetchNotes()
    } catch (e) {
      setError(e.message)
    }
  }

  function startEditing(note) {
    setEditingId(note._id)
    setTitle(note.title)
    setContent(note.content)
    setError('')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900">{submitLabel}</h2>
        <p className="mt-1 text-sm text-stone-600">
          Capture quick ideas and keep your notes organized.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-stone-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Project checklist"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm text-stone-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your note..."
              rows={6}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
              maxLength={2000}
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : submitLabel}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">Your notes</h2>
          <button
            onClick={fetchNotes}
            className="rounded-md border border-stone-300 px-3 py-1 text-xs text-stone-600 transition hover:bg-stone-100"
          >
            Refresh
          </button>
        </div>

        {loading ? <p className="text-stone-600">Loading notes...</p> : null}

        {!loading && notes.length === 0 ? (
          <p className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
            No notes yet. Create your first one from the form.
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          {notes.map((note) => (
            <article
              key={note._id}
              className="rounded-md border border-stone-200 bg-stone-50 p-4"
            >
              <h3 className="line-clamp-1 text-base font-semibold text-stone-900">{note.title}</h3>
              <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-sm text-stone-700">
                {note.content}
              </p>
              <p className="mt-3 text-xs text-stone-500">
                Updated {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEditing(note)}
                  className="rounded-md border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700 hover:bg-stone-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default NotesClient
