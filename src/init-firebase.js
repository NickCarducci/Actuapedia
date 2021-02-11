import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
//import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyBs-6gIyevm_usc5-j_sEMTBB7IVqC3esQ",
  authDomain: "actuapedia-18ikj.firebaseapp.com",
  projectId: "actuapedia-18ikj",
  storageBucket: "actuapedia-18ikj.appspot.com",
  messagingSenderId: "751068077382",
  appId: "1:751068077382:web:08e6894f678b548494d947"
};
!firebase.apps.length && firebase.initializeApp(firebaseConfig);
!firebase.apps.length && firebase.firestore().enablePersistence(false);
//firebase.firestore().enablePersistence({ synchronizeTabs: true });
//firebase.auth();
//firebase.storage();
/*.settings({
  cacheSizeBytes: 1048576
});*/
//firebase.firestore().settings({ persistence: false });

export default firebase;
