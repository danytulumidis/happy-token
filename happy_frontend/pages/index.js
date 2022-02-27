import Head from 'next/head'
import InfoCard from '../components/InfoCard'

export default function Home() {
  return (
    <div className="bg-gradient-to-t from-slate-700 to-gray-900 text-white">
      <Head>
          <title>Happy Token</title>
          <meta name="description" content="Mint some Happy Token and enjoy life" />
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-around items-center min-h-screen">
        
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-violet-500">Happy Token</h1>
        <p className="text-4xl">Mint some Happy Tokens, enjoy life and put on your biggest smile!</p>
        <button className="px-9 py-5 text-2xl text-orange-600 font-semibold border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition hover:-translate-y-2 duration-300 ease-in-out hover:scale-100">Mint Token</button>
        <div className="flex flex-row gap-10">
          <InfoCard info="Amount of your Happy Tokens" tokenAmount={5}/>
          <InfoCard info="Tokens Liquidity" tokenAmount={15}/>
          <InfoCard info="Maximum of Tokens" tokenAmount={100}/>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}
