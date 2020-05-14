import { useState, useEffect } from 'react'
import { isAddress } from 'web3-utils'
import { Networks } from '../utils'

async function mint(
  network: Networks,
  address: string
): Promise<{
  success: boolean
  transactionHash?: string
  message?: string
}> {
  const response = await fetch(`/api/mint?network=${network}&address=${address}`)

  if (response.status === 200) {
    const { transactionHash } = await response.json()
    return {
      success: true,
      transactionHash,
    }
  } else {
    return {
      success: false,
      message: response.statusText,
    }
  }
}

function Faucet({ network }: { network: Networks }) {
  const [address, setAddress] = useState<string>(undefined)
  const [isValidAddress, setIsValidAddress] = useState<boolean>(undefined)
  const [status, setStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILURE'>(undefined)
  const [message, setMessage] = useState<string>(undefined)
  const isButtonDisabled = !isValidAddress || status === 'PENDING'
  const showStatusMessage = status === 'SUCCESS' || status === 'FAILURE'

  // update 'isValidAddress' on 'address' change
  useEffect(() => {
    if (typeof address === 'undefined' || address === '') {
      setIsValidAddress(undefined)
    } else {
      setIsValidAddress(isAddress(address))
    }
  }, [address])

  // once button is clicked
  const onClick = async () => {
    setStatus('PENDING')

    const result = await mint(network, address)

    if (result.success) {
      setMessage(result.transactionHash)
      setStatus('SUCCESS')
    } else {
      setMessage(result.message)
      setStatus('FAILURE')
    }
  }

  return (
    <div className="container">
      <div className="inputs">
        <input onChange={(e) => setAddress(e.target.value)} defaultValue={address} />
        &nbsp;
        <button onClick={onClick} disabled={isButtonDisabled}>
          Give me hopr tokens!
        </button>
      </div>
      {!showStatusMessage ? null : status === 'SUCCESS' ? (
        <div>
          ✔ Your transaction is pending:{' '}
          <a href={`http://${network}.etherscan.io/tx/${message}`} target="_blank" rel="noopener noreferrer">
            etherscan
          </a>
        </div>
      ) : (
        <div>
          <p>🤕 Something broke: '{message}'</p>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 0.5 0rem;
          height: 100px;
        }

        .inputs {
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
          border: 1px solid ${isValidAddress === false ? 'red' : 'black'};
        }

        button {
          background-color: #3c4146;
          color: #eef4ec;
          padding: 0.5em;
          border: none;
          width: 150px;
          cursor: ${isValidAddress ? 'pointer' : 'not-allowed'};
          opacity: ${isValidAddress ? 1 : 0.75};
        }
      `}</style>
    </div>
  )
}

export default Faucet
