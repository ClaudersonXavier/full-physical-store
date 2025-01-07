export const calcularFrete = async (cepOrigem: string, cepDestino: string) => {

    try{

        const info = JSON.stringify({
            "cepDestino": cepOrigem,
            "cepOrigem": cepDestino,
            "comprimento": "20",
            "largura": "15",
            "altura": "10"
        })
    
        const response = await fetch("https://www.correios.com.br/@@precosEPrazosView", {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              'Cookie': 'LBprdExt2=852033546.47873.0000; LBprdint2=2923036682.47873.0000; TS01a7fccb=01ff9e5fc69eaa31ef24952f330d378aa3c995a8364f88670291f7883e526f24151e93ecc9801f865a91573c965e02a5c37390c7a5c9787fadd95fdeaeebe6b7af072b868a0ee8b0b2f86c8342e8560f0b7eee78d5' 
            },
            body: info,
          });
    
          if(!response.ok){
            throw new Error("Erro ao comunicar com a API dos correios.")
          }
    
          const data = await response.json()

          if(!data){
            throw new Error("Erro no recebimento dos dados.")
          }
    
          //console.log(data)
          //console.log(data[0].prazo)
    
          return {
            sedex: {
                prazo: data[0].prazo,
                preco: data[0].precoPPN
            },
            PAC: {
                prazo: data[1].prazo,
                preco: data[1].precoPPN
            }
          }

    }catch(error){
        throw new Error("Erro na api dos correios.")
    }
}