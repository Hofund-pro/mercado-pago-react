import React, {useEffect, useState} from 'react'
import {axiosAPI, axiosMercadoPago} from "./config/axiosBase";
import useScript from "./hooks/useScript";
import {Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";

type DadosType = {
  cardholderName: string,
  cardholderEmail: string,
  identificationNumber: string,
  identificationType: string,
  cardNumber: string,
  expirationDate: string,
  securityCode: string,
  issuerId: number,
  installments: number,
  paymentMethodId: string,
  token: string
}

function App() {
  const [token, setToken] = useState('TEST-1472260698705580-031515-8e39123c67f955ccbcc738acfbd6247c-1133773666');
  const [parcelas, setParcelas] = useState<Array<any>>([]);
  const [mp, setMp] = useState<any>();
  const {loaded} = useScript("https://sdk.mercadopago.com/js/v2");
  const [dados, setDados] = useState<DadosType>({
    cardholderName: '',
    cardholderEmail: '',
    identificationNumber: '',
    identificationType: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    issuerId: 0,
    installments: 1,
    paymentMethodId: '',
    token: ''
  });
  
  useEffect(() => {
    if (loaded) {
      // @ts-ignore
      const script = new MercadoPago('TEST-6f6ef866-fe42-4aa2-bd0b-07c9d4c09b59');
      setMp(script);
    }
  }, [loaded]);
  
  useEffect(() => {
    if (dados.identificationNumber.length === 11) {
      setDados({...dados, identificationType: 'CPF'});
    } else if (dados.identificationNumber.length == 14) {
      setDados({...dados, identificationType: 'CNPJ'});
    } else {
      setDados({...dados, identificationType: ''});
    }
  }, [dados.identificationNumber]);
  
  useEffect(() => {
    if (dados.cardNumber.length >= 6) {
      mp.getPaymentMethods({bin: dados.cardNumber})
        .then((payments: any) => {
          setDados({...dados, issuerId: payments.results[0].issuer.id});
          setParcelas(payments.results[0].payer_costs);
        })
        .catch((err: any) => {
          console.log(err);
        })
      ;
    }
  }, [dados.cardNumber]);
  
  useEffect(() => {
    if (parcelas.length > 0 && parcelas[dados.installments - 1].payment_method_option_id) {
      setDados({...dados, paymentMethodId: parcelas[dados.installments - 1].payment_method_option_id});
    }
  }, [parcelas, dados.installments]);
  
  const gerarToken = () => {
    mp.createCardToken(dados)
      .then((cardToken: any) => {
        setDados({...dados, token: cardToken.id});
        concluirPagamento();
      })
      .catch((err: any) => {
        console.log(err);
      })
    ;
  }
  
  const concluirPagamento = () => {
    axiosAPI().post('/payment', dados)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    ;
  }
  
  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            label={'Nome do titular como aparece no cartão'}
            value={dados.cardholderName}
            onChange={(t) => setDados({...dados, cardholderName: t.target.value})}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label={'E-mail'}
            value={dados.cardholderEmail}
            onChange={(t) => setDados({...dados, cardholderEmail: t.target.value})}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label={dados.identificationType != '' ? dados.identificationType : 'CPF/CNPJ'}
            value={dados.identificationNumber}
            onChange={(t) => setDados({...dados, identificationNumber: t.target.value})}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label={'Número do cartão'}
            value={dados.cardNumber}
            onChange={(t) => setDados({...dados, cardNumber: t.target.value})}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label={'Data de vencimento'}
            placeholder={'MM/AA'}
            value={dados.expirationDate}
            onChange={(t) => setDados({...dados, expirationDate: t.target.value})}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label={'Código de segurança'}
            value={dados.securityCode}
            onChange={(t) => setDados({...dados, securityCode: t.target.value})}
            fullWidth
          />
        </Grid>
        
        {parcelas.length > 0 ?
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="select-label">Parcelas</InputLabel>
              <Select
                labelId="select-label"
                id="simple-select"
                value={dados.installments}
                label="Parcelas"
                onChange={(t) => setDados({...dados, installments: parseInt(`${t.target.value}`)})}
              >
                {parcelas.map((parcela: any) => (
                  <MenuItem
                    key={parcela.installments}
                    value={parcela.installments}
                  >
                    {parcela.installments}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          : null
        }
      </Grid>
      
      <Button
        variant={"outlined"}
        onClick={gerarToken}
        fullWidth
      >
        Gerar Token
      </Button>
    </Paper>
  )
}

export default App
