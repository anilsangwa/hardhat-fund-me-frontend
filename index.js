// import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.2.esm.min.js'
import { ethers } from './ethers-5.1.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw // Connect Function
async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    connectButton.innerHTML = 'Connected'
  } else {
    connectButton.innerHTML = 'Please Install Metamask'
  }
}
async function withdraw() {
  if (typeof window.ethereum !== 'undefined') {
    // provider / connection to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // signer / wallet /someone with some gas
    const signer = provider.getSigner()
    // contract that we are interacting with
    // ^ABI & Address
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }
}
async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(`Balance Is ${ethers.utils.formatEther(balance)}`)
  }
}

// Fund Function
async function fund() {
  const ethAmount = document.getElementById('ethAmount').value
  //   ethAmount = '7'
  console.log(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== 'undefined') {
    // provider / connection to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // signer / wallet /someone with some gas
    const signer = provider.getSigner()
    // contract that we are interacting with
    // ^ABI & Address
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}`)
  // listen for transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with  ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

// Withdraw Function
