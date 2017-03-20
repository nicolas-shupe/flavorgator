const DEBUG = true;

function debug(message) {
  if (DEBUG) {
    console.log(message);
  }
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAasOds-5xi2RPUiy4tbB5hiLfdjlAdIqw",
  authDomain: "flavor-gator-95ca4.firebaseapp.com",
  databaseURL: "https://flavor-gator-95ca4.firebaseio.com",
  storageBucket: "flavor-gator-95ca4.appspot.com",
  messagingSenderId: "477854566477"
};
firebase.initializeApp(config);

const auth = firebase.auth();

var database = firebase.database();

async function tokenValid(token, expiration) {
  const parent = token + "/";
  token = getCookie(token);
  if (token == null) {
    debug("Token DNE");
    return false;
  }

  token = forge.md.sha256.create().update(token).digest().toHex();

  var valid = false;
  
  ref = database.ref(parent + token);
  await ref.once("value", function(snapshot) {
    if (!snapshot.exists()) {
      debug("Token already exists!");
      return;
    }

    const date = new Date(snapshot.val().date);
    const today = new Date();
    if (today - date > expiration) {
      debug("Token expired");
      ref.remove();
    }
    else {
      debug("Token valid")
      valid = true;
    }
  });
  return valid;
}

async function tokenUser(token, expiration) {
  const parent = token + "/";
  if (!(await tokenValid(token, expiration))) {
    debug("Invalid token!");
    return null;
  }
  token = getCookie(token);
  token = forge.md.sha256.create().update(token).digest().toHex();
  ref = database.ref(parent + token);

  var uid = null;
  await ref.once("value", function(snapshot) {
    uid = snapshot.val().uid;
    debug("UID: " + uid);
  });
  return uid;
}

async function generateToken(tokenType, expiration, firebaseUser) {
  const parent = tokenType + "/";
  var token = generateRandomString50();
  const hash = forge.md.sha256.create().update(token).digest().toHex();
  var ref = database.ref(parent + hash);
  ref.once("value", function(snapshot) {
    if (!snapshot.exists()) {
      debug("Token: " + token);
      debug("Hash: " + hash);
      setCookieDate(tokenType, token, expiration);
      database.ref(parent + hash).set({
        uid: firebaseUser.uid,
        date: new Date().toUTCString()
      });
    }
    else {
      generateToken(tokenType, expiration, firebaseUser);
    }
  });
}

async function deleteToken(tokenType) {
  const parent = tokenType + "/";
  const hash = forge.md.sha256.create().update(token).digest().toHex();

  deleteCookie(tokenType);

}

function signIn(email, password) {
  auth.signInWithEmailAndPassword(email, password).then(() => {
    const firebaseUser = auth.currentUser;
    generateToken("rememberMe", 5*24*1000*1000, firebaseUser);
  }, e => {
    debug(e.message)
  });
}

function register(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function registerForm(form) {
  const email = form.email.value;
  const password = form.password.value;
  const confirm_password = form.confirm_password.value;

  if (password == confirm_password) {
    register(email, password).then(() => {console.log("Success!")}).catch(e => console.log(e.message));
  }
  else {
    console.log("Passwords do not match!");
  }
}

function loginForm(form) {
  const email = form.email.value;
  const password = form.password.value;

  signIn(email, password);
}

async function rememberMe(onSuccess, onFailure) {
  const uid = await tokenUser("rememberMe", 5*24*60*60*1000);
  if (uid != null) {
    onSuccess();
  }
  else {
    onFailure();
  }
};