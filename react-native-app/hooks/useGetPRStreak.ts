import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.EXPO_PUBLIC_API_URL + '/competitions/bests/'


export default function useGetPRStreak(ID: string) {

  const {data, isPending, error} =  useQuery({
    queryKey: [ID+"PRStreak"],
    queryFn: async () => {
      return await fetch(endpoint + ID, {headers:  {"Authorization": "Bearer " + process.env.PRIVATE_TOKEN}}).then((r) => {
        if (!r.ok) {
          throw new Error("something when wrong.")
        } else {
          return r.json()
        }
      });

    },
  });
  
  if (data) {

  }
  
}

//This function will calculate the best PR streak for a competitior
function getBestPRStreak(data : any[]) {

    const countBestPRStreak = 0
    const currentBestEvent = new Map<string,number>() 

    //Les résutats sont déjà triés par data de compétitions dans la base de données
    //Chaque enregistrement parcouru sera une épreuve (single et/ou avg) dans la compétition.
    for (const eventCompetition of data) {

        //Si l'enregistrement est déjà dans la map
        const currentMapEvent : number | undefined = currentBestEvent.get(eventCompetition?.event_id+'-single')
        if (currentMapEvent) {
            
            //Traitement du meilleur temps de la compétition
            //Si pas DNF/DNS
            if (eventCompetition?.best !== -1 && eventCompetition?.best > 0 ) {
                
            }


        } else {

        }
          
    }

}
