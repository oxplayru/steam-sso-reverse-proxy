# Steam SSO Reverse Proxy
Simple way to protect your apps with steam authorization

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

  * Docker or Node.js
  * ACL environment variable should contain your SteamID
  * SteamID should be 64 bit format (Example: 76561198035511373)

### Installing

Install backend server:

```
docker run -dit --name apache httpd:2.4
```

Change ACL to your own before you run example

```
docker run -dit --link apache:backend -p 80:80 -e REALM_URL=$(echo -n "http://";curl -s ident.me) -e ACL="[76561198035511373, 76561198756150798]"  innerfire/steam-sso-reverse-proxy
```

## Custom domain example
SSO work fine without domain, but you're can setup it in REALM_URL variable

```
docker run -dit --link apache:backend -p 80:80 -e REALM_URL="https://google.com" -e ACL="[76561198035511373, 76561198756150798]"  innerfire/steam-sso-reverse-proxy
```

## Built With

* [Passport Steam](https://github.com/liamcurry/passport-steam) - Steam SSO module for node.js
* [Node HTTP Proxy](https://github.com/nodejitsu/node-http-proxy) - HTTP programmable proxying library

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
