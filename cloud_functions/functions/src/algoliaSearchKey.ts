import algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";
import { env } from "./config";

const algoliaClient = algoliasearch(env.algolia.app, env.algolia.key);

export const getAlgoliaSearchKey = functions.https.onCall(async (
  data: { index: string },
  context: functions.https.CallableContext
) => {
  const requestedIndex = data.index
  try {
    if (!context.auth || !context.auth.token) throw new Error("Unauthenticated")

    const allIndicesRoles = ['ADMIN',"TEAM"] // you can add more roles here that need access to all algolia indices
  
    const rolesIndicesAccess = {
      "ROLE":["index_1","index_2"]
    }
    const userRoles = context.auth.token.roles
    if (userRoles.some(role=> allIndicesRoles.includes(role)||rolesIndicesAccess[role].includes(requestedIndex))){
      const validUntil = Math.floor(Date.now() / 1000) + 3600;
    const key = algoliaClient.generateSecuredApiKey(
              env.algolia.search,
              {
                filters:"",
                validUntil,
                restrictIndices: [requestedIndex],
                userToken: context.auth.uid,
              }
            );     
    return {
      data: key,
      success: true,
    };
    }else{
      return {
        message: 'Missing Required roles for this index',
        success: false,
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error,
      message: error.message,
    };
  }
})

