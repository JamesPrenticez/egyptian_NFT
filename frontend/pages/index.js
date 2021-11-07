import Head from 'next/head'
import Heros from '../components/Heros'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Head>
        <title>Egyptian NTF's</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Heros />

    </div>
  )
}