import Head from 'next/head'
import Input from '../components/Input'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>HOPR token Faucet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to the <a href="https://hopr.network/">HOPR</a> token faucet!
        </h1>

        <p className="description">This faucet will mint 100 HOPR tokens to your address.</p>

        <div>
          <Input />
        </div>
      </main>

      <footer>
        <a href="https://github.com/hoprnet" target="_blank" rel="noopener noreferrer">
          hoprnet <img src="/github-32x.png" alt="Github Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 75px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: 'Courier New', Courier, monospace;
        }

        .logo {
          height: 1em;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
