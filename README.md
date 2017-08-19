# Steam SSO Reverse Proxy
Simple way to protect your apps with steam authorization

## Getting Started
### Prerequisites

  * Docker or Node.js
  * ACL environment variable should contain your SteamID
  * SteamID should be 64 bit format (Example: 76561198035511373)

### Installing via Docker

Install backend server:

```
docker run -dit --name apache httpd:2.4
```

Change ACL to your own before you run example

```
docker run -dit --link apache:backend -p 80:80 -e REALM_URL=$(echo -n "http://";curl -s ident.me) -e ACL="[76561198035511373, 76561198756150798]"  innerfire/steam-sso-reverse-proxy
```

### Installing on [Cloud9](https://c9.io)
1. Create a new workspace
2. Set link to this repositoty
3. Choose template Node.js
4. Run command:
```
npm install
```
5. Add ACL variable to runner
6. Run app.js script

## Custom domain example
SSO work fine without domain, but you're can setup it in REALM_URL variable

```
docker run -dit --link apache:backend -p 80:80 -e REALM_URL="https://google.com" -e ACL="[76561198035511373, 76561198756150798]"  innerfire/steam-sso-reverse-proxy
```
## Tips:
* If you're too tired to manage ports manually or need SSL support then you should look at [Nginx Proxy](https://github.com/jwilder/nginx-proxy)
* This system is very useful with steam browser autologin

## Built With

* [Passport Steam](https://github.com/liamcurry/passport-steam) - Steam SSO module for node.js
* [Node HTTP Proxy](https://github.com/nodejitsu/node-http-proxy) - HTTP programmable proxying library

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/oxplayru/steam-sso-reverse-proxy/blob/master/LICENSE) file for details
