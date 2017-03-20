function setCookieDate(cname,cvalue,expiration) {
    var d = new Date();
    d.setTime(d.getTime() + expiration);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookie(cname,cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + "path=/";
}

function deleteCookie(cname) {
    setCookieDate(cname, ";", "expires=Mon, 07 Sep 1998 00:00:01 GMT;")
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function generateRandomString50() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!%^&*()?";
  var output = "";
  for (char = 0; char < 50; char++) {
    output += charset[Math.floor(Math.random()*charset.length)];
  }

  return output;
}

class Token {
    constructor(type, expiration) {
        this.type = type;
        this.expiration = expiration;
        this.value = getCookie(type);
    }

    generate(database) {
        this.value = generateRandomString50();
        setCookie(this.type);
        database(this.value);
    }

    checksum(checksum) {
        return this.value == checksum;
    }
}