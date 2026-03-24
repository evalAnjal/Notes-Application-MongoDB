import NotesClient from '@/_components/NotesClient'

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2 border-b border-stone-300 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Notes Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Simple note taking application
          </h1>
          <p className="max-w-2xl text-sm text-stone-600 md:text-base">
            Write ideas, edit them anytime, and keep everything in one place.
          </p>
        </header>

        <NotesClient />
      </div>
    </main>
  )
}
