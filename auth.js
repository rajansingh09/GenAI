// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyCaIQgqKvOhF2QQKpfmUChrpGm4HeqVQ5I",
  authDomain: "learngen-8b396.firebaseapp.com",
  projectId: "learngen-8b396",
  storageBucket: "learngen-8b396.firebasestorage.app",
  messagingSenderId: "620644659298",
  appId: "1:620644659298:web:821cc0cc32ddca42e3a13b",
  measurementId: "G-189HZRTD67"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Auth state observer
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      console.log("User logged in:", user.email);
      // Redirect to profile page if not already there
      if (!window.location.pathname.includes('profile.html')) {
        window.location.href = 'profile.html';
      }
    } else {
      // User is signed out
      console.log("User signed out");
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('login.html') && 
          !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
      }
    }
  });
  
  // Example: Don't redirect if already on signup or login page
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // Only redirect if NOT on login or signup page
        if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('signup.html')) {
            window.location.href = 'login.html';
        }
    }
});
  
  // Sign Up Function
  function signUp(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Add additional user info to Firestore
        return db.collection('users').doc(userCredential.user.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          role: 'student',
          grade: '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`
        });
      })
      .catch(error => {
        throw error;
      });
  }
  
  // Login Function
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        throw error;
      });
  }
  
  // Logout Function
  function logout() {
    return auth.signOut();
  }
  
  // Get Current User Data
  function getCurrentUserData() {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.reject("No user");
    return firebase.firestore().collection('users').doc(user.uid).get()
        .then(doc => {
            if (!doc.exists) throw new Error("User profile not found");
            return doc.data();
        });
  }
  
  // Create User Profile
  function createUserProfile(user) {
    return firebase.firestore().collection('users').doc(user.uid).set({
        name: user.displayName || "", // or use a signup form value
        email: user.email,
        grade: "",
        avatar: "",
        isNewUser: true
    });
  }
  
  // Update User Profile
  function updateProfile(data) {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.reject("No user");
    return firebase.firestore().collection('users').doc(user.uid).update({
        ...data,
        isNewUser: false // Mark as not new after first update
    });
  }