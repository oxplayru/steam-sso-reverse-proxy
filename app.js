var express = require('express')
  , passport = require('passport')
  , session = require('express-session')
  , SteamStrategy = require('./').Strategy;
  
var http = require('http'),
    httpProxy = require('http-proxy');
    
var proxy = httpProxy.createProxyServer();

//For testing on c9
if (process.env.C9_USER) {
  process.env.REALM_URL = "https://" + process.env.C9_HOSTNAME;
  process.env.BACKEND_URL = "http://127.0.0.1:9999/";
  
  http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('This is works');
    res.end();
  }).listen(9999, "127.0.0.1");
}

//Env checks

if (typeof process.env.ACL === "undefined") {
    throw(new Error("Environment variable 'ACL' not found"));
}

if (typeof process.env.REALM_URL === "undefined"){
    throw(new Error("Environment variable 'REALM_URL' not found"));
}

// Main logic

passport.use(new SteamStrategy({
    realm: process.env.REALM_URL,
    returnURL: process.env.RETURN_URL || (process.env.REALM_URL + "/auth/steam/return") ,
    profile: false
  },
  function(identifier, profile, done) {
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function random (low, high) {
    return Math.random() * (high - low) + low;
}

var app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || toString(random(1000000000,9999999999)),
    name: process.env.SESSION_ID || "steam",
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/logout', ensureAuthenticated, function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


app.all('/*', ensureAuthenticated, function(req, res){
  try{
    var userID = req.user.identifier.replace('http://steamcommunity.com/openid/id/','');
    var json = JSON.parse(process.env.ACL);
    var found = false;
    
    json.forEach(function(sid) {
        if (sid == userID) {
          found = true;
        }
        return;
    });
    
    if (found){
      proxy.web(req, res, {
        target: process.env.BACKEND_URL || "http://backend"
      }, function(e) { res.status(500).send(); console.error(e); });
    }else{
      req.logout();
      res.status(403).send();
      console.warn( "Access denied to user " + 'http://steamcommunity.com/profiles/' + userID );
    }
    
  }
  catch(e){
    if (e.message !== "Cannot read property 'identifier' of null"){ res.status(500).send(); console.error(e); }
  }
});

app.listen(process.env.PORT || 80);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  
  res.redirect('/auth/steam');
}