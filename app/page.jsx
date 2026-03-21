
import dbConnect from '../lib/db'
import NotesClient from '@/_components/NotesClient'

export default async  function Home() {
  await dbConnect() 
  return (
  <>
  <div className='container mx-auto p-4'>
    <h1>Notes App</h1>
    <NotesClient />
  </div>
  </>
  );
}
