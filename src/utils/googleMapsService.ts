export class GoogleApiService{

    static async getCordenates(cep: string){

        try{

            const apiKey = process.env.GOOGLE_API_KEY
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${apiKey}`)
            

            if(!response.ok){
                throw new Error("Erro ao comunicar com a API do google.")
            }

            const data = await response.json()

            if(!data.results){
                throw new Error('Coordenadas não encontradas!')
            }

            const location = data.results[0].geometry.location;

           
            return {
                latitude: location.lat,
                longitude: location.lng
            }
        
        }catch(error){
            throw new Error(error)
        }
    }

    static async distanceCalculator(lat1: string, lng1: string, lat2: string, lng2: string){
        
        const apiKey = process.env.GOOGLE_API_KEY

        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&key=${apiKey}`);

        const data = await response.json()

        data.rows[0].elements[0].distance['value']
        
        return data.rows[0].elements[0].distance['value'] / 1000;

    }
}