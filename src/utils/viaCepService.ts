export const cepInfos = async (cep: string) => {
    
    try{
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        
         if (!response.ok) {
            throw new Error;
        }

        const data = await response.json() 

        if(!data){
            throw new Error("Erro no recebimento dos dados.")
          }
          
        return data;

    }catch(error){
        throw new Error('Erro na requisição ao viacep.');
    }
}