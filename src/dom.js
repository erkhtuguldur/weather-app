const apiKey="7EV5K6YP5DWVZGL3PSMBC4FWR";
const unit="metric"
async function apiRequest(s,unit){
    if(s!=""){
       try {
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${s}?unitGroup=${unit}&key=${apiKey}&contentType=json`);
        

        if(!response.ok){
                return { success: false, message: `Request failed: ${response.statusText}` };
            }
            else{
                return { success: true, data: await response.json() };
            }
        
    } catch (error) {
        return { success: false, message: `Request failed: ${error.message}` };
        } 
    }
    
   
}

export default apiRequest;