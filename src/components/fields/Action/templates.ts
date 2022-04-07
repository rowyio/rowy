export const RUN_ACTION_TEMPLATE = `const action:Action = async ({row,ref,db,storage,auth,actionParams,user}) => {
    // Write your action code here
    // for example:
    // const authToken = await rowy.secrets.get("service")
    // try {
    // const resp = await fetch('https://example.com/api/v1/users/'+ref.id,{
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': authToken
    //   },
    //   body: JSON.stringify(row)
    // })
    // 
    // return {
    //   success: true,
    //   message: 'User updated successfully on example service',  
    //   status: "upto date"
    // }
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: 'User update failed on example service',
    //     }
    // }
    // checkout the documentation for more info: https://docs.rowy.io/field-types/action#script
  }`;

export const UNDO_ACTION_TEMPLATE = `const action : Action = async ({row,ref,db,storage,auth,actionParams,user}) => {
    // Write your undo code here
    // for example:
    // const authToken = await rowy.secrets.get("service")
    // try {
    // const resp = await fetch('https://example.com/api/v1/users/'+ref.id,{
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': authToken
    //   },
    //   body: JSON.stringify(row)
    // })
    //
    // return {
    //   success: true,
    //   message: 'User deleted successfully on example service',
    //   status: null
    // }
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: 'User delete failed on example service',
    //     }
    // }
  }`;
