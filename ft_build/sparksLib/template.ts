export const dependencies = {
    // --- Add your dependencies
    // algoliasearch: "^4.8.3",
};
// Define your spark
const sparkName = async (data, sparkContext) => {
  
    // Your spark inputs
    const { row, targetPath, fieldsToSync } = data;
    const { triggerType, change } = sparkContext;

    // ---------------------------------------------
    // --- Utilise your dependencies --- 
    // const algoliasearch = require("algoliasearch");
  
    // ---------------------------------------------
    // --- Get the secret from Secrets Manager
    // Example: Algolia Secret
    // const { getSecret } = require("../utils");
    // const { appId, adminKey } = await getSecret("algolia");

    // ---------------------------------------------
    // --- Connect to any third party extensions --- 
    // Example Algolia
    // const client = algoliasearch(appId, adminKey);
    // const _index = client.initIndex(index); 

    
    // ---------------------------------------------
    // --- Handle required trigger actions --- 
    switch (triggerType) {
        
        case "create":
            // create trigger actions
            break;

        case "update":
            // update trigger actions
            break;
        
            case "delete":
            // delete trigger actions
            break;
        
            default:
          break;
      }
      return true;
    

};

export default sparkName;
