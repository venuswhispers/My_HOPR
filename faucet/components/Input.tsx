import { useState } from 'react'

function Input() {
  const [address, setAddress] = useState<string>(undefined)

  return (
    <div className="container">
      <input onChange={(e) => setAddress(e.target.value)} defaultValue={address} />
      &nbsp;
      <button>Send me HOPR!</button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 0 0.5rem;
        }

        input {
          width: 310px;
          max-width: 100%;
          line-height: 2.5em;
        }

        button {
          background-color: #3c4146;
          color: #eef4ec;
          padding: 0.5em;
          border: none;
          width: 150px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default Input
