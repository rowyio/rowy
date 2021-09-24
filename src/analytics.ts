import firebase from "firebase/app";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArABiYGK7dZgwSk0pw_6vKbOt6U1ZRPpc",
  authDomain: "rowy-service.firebaseapp.com",
  projectId: "rowy-service",
  storageBucket: "rowy-service.appspot.com",
  messagingSenderId: "305614947641",
  appId: "1:305614947641:web:cb10467e7c11c93d6e14e8",
  measurementId: "G-0VWE25LFZJ",
};

// Initialize Firebase
const rowyServiceApp = firebase.initializeApp(firebaseConfig, "rowy-service");

export const analytics = firebase.analytics(rowyServiceApp);
