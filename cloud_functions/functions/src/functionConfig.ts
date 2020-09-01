export default {
  collectionPath: "feedback",
  onCreate: true,
  onUpdate: false,
  onDelete: false,
  requiredFields: ["email", "message", "type", "user", "source", "pagePath"],
  messageDocGenerator: (snapshot) => {
    const docData = snapshot.data();
    const { email, message, type, user, source, pagePath } = docData;
    const { displayName } = user;
    console.log({ displayName, email, message, type, user, source, pagePath });

    // General/Bug/Idea
    const generalText =
      `Hey!, ` +
      displayName +
      "(" +
      email +
      ")" +
      ` has the following general feedback for (` +
      source.split(".")[0] +
      `):*` +
      message +
      `* `;
    const bugText =
      `Bug report: *` +
      message +
      `*\n by *` +
      displayName +
      "(" +
      email +
      ")*\n" +
      "reported on:" +
      source +
      pagePath;
    const ideaText =
      displayName +
      "(" +
      email +
      ")" +
      "has an amazing idea! for " +
      source.split(".")[0] +
      " \n messaged saying:" +
      message;
    let text = "blank";
    switch (type) {
      case "Bug":
        text = bugText;
        break;
      case "Idea":
        text = ideaText;
        break;
      case "General":
        text = generalText;
        break;
      default:
        text = "unknown feedback type";
    }

    if (source.includes("education")) {
      return {
        text,
        emails: ["heath@antler.co", "harini@antler.co", "shams@antler.co"],
      };
    } else {
      return { text, channel: "C01561T4AMB" };
    }
  },
} as any;
export const collectionPath = "";
