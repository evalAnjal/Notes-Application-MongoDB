
import dbConnect from '../lib/db'

export default async  function Home() {
  await dbConnect()
  return (
  <h1>gg</h1>
  );
}
