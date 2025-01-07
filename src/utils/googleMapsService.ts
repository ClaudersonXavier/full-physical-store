export class GoogleApiService{

    static async getCordenates(cep: string){

        try{
            const apiKey = process.env.GOOGLE_API_KEY
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${apiKey}`)

            if(!response.ok){
                throw new Error("Erro ao comunicar com a API do google.")
            }

            const data = await response.json()

            if(data.results[0].length === 0 || !data.results){
                throw new Error('Coordenadas não encontradas!')
            }

            const location = data.results[0].geometry.location;

            return {
                latitude: location.lat,
                longitude: location.lng
            }
        
        }catch(error){
            throw new Error('Erro na requisição a API do google!')
        }
    }
}