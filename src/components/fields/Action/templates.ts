export const RUN_ACTION_TEMPLATE = `// Import any NPM package needed
// import _ from "lodash";

const action: Action = async ({ row, ref, db, storage, auth, actionParams, user, logging }) => {
  logging.log("action started");

  /*
  // Example:
  const authToken = await rowy.secrets.get("service");
  try {
    const resp = await fetch("https://example.com/api/v1/users/" + ref.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(row),
    });
    return {
      success: true,
      message: "User updated successfully on example service",
      status: "upto date",
    };
  } catch (error) {
    return {
      success: false,
      message: "User update failed on example service",
    };
  }
  */
};

export default action;
`;

export const UNDO_ACTION_TEMPLATE = `// Import any NPM package needed
// import _ from "lodash";

const action: Action = async ({ row, ref, db, storage, auth, actionParams, user, logging }) => {
  logging.log("action started");

  /*
  // Example:
  const authToken = await rowy.secrets.get("service");
  try {
    const resp = await fetch("https://example.com/api/v1/users/" + ref.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(row),
    });
    return {
      success: true,
      message: "User deleted successfully on example service",
      status: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "User delete failed on example service",
    };
  }
  */
};

export default action;
`;
