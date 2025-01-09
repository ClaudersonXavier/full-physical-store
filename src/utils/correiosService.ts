export const calcularFrete = async (cepOrigem: string, cepDestino: string) => {

  try{
    let cepO: string, cepD: string
    if(cepOrigem.includes('-')){
      cepO =cepOrigem.replace('-', '')
    }
    if(cepDestino.includes('-')){
      cepD = cepDestino.replace('-','')
    }

    console.log(cepD)
    console.log(cepO)

    const info = JSON.stringify({
      "cepDestino": cepD,
      "cepOrigem": cepO,
      "comprimento": "20",
      "largura": "15",
      "altura": "10"
    })
    
    const response = await fetch("https://www.correios.com.br/@@precosEPrazosView", {
      method: 'POST', 
      headers: {
      'Content-Type': 'application/json',
      'Cookie': 'LBprdExt2=852033546.47873.0000; LBprdint2=2520383498.47873.0000; TS01a7fccb=01ff9e5fc6b03e296adf2226582b3eba65eb4aae911ac0a164f39720115894181e7fe912bf76a5515ce32d62124a444e5dfcd6fcca338442a1738e310e9280febdbfaf7c87552e8ad74b77d206c7e3507fcf1a03c7'
      },
      body: info,
    });
    
    if(!response.ok){
      throw new Error("Erro ao comunicar com a API dos correios.")
    }
    
    const data = await response.json()

    console.log(data)

    if(!data){
      throw new Error("Erro no recebimento dos dados.")
    }

    if (data[0].status === 0) {
      throw new Error(data[0].mensagem);
    }
    
    return {
      value: [
        { 
          prazo: data[0].prazo,
          codProdutoAgencia: data[0].codProdutoAgencia,
          preco: data[0].precoAgencia,
          description: data[0].urlTitulo
        },
        {
          prazo: data[1].prazo,
          codProdutoAgencia: data[1].codProdutoAgencia,
          preco: data[1].precoAgencia,
          description: data[1].urlTitulo
        }
      ]
    }

  }catch(error){
    throw new Error(error)
  }
}