import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {axiosMercadoPago} from "./config/axiosBase";

function App() {
  const [token, setToken] = useState('TEST-1472260698705580-031515-8e39123c67f955ccbcc738acfbd6247c-1133773666');
  const obterMeiosDePagamento = () => {
    axiosMercadoPago().get('/v1/payment_methods', {
      headers: {
        'Autorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={obterMeiosDePagamento}>
          Obter meios de pagamento
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
