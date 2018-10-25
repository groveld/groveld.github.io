---
layout      : post
author      : groveld
title       : Self Signed Certificate with Custom Root CA
description : Install TeamSpeak 3 on a Ubuntu 10.04 server.
tags        : [teamspeak, linux]
---

## Create Root CA (Done once)

### Create Root Key

#### openssl.cnf

```ini
# OpenSSL configuration file.

[ ca ]
# `man ca`
default_ca = CA_default

[ CA_default ]
# Directory and file locations.
dir = /root/ca
certs = $dir/certs
crl_dir = $dir/crl
new_certs_dir = $dir/newcerts
database = $dir/index.txt
serial = $dir/serial
RANDFILE = $dir/private/.rand

# The root key and root certificate.
private_key = $dir/private/ca.key.pem
certificate = $dir/certs/ca.cert.pem

# For certificate revocation lists.
crlnumber = $dir/crlnumber
crl = $dir/crl/ca.crl.pem
crl_extensions = crl_ext
default_crl_days = 30

# SHA-1 is deprecated, so use SHA-2 instead.
default_md = sha256

name_opt = ca_default
cert_opt = ca_default
default_days = 375
preserve = no
policy = policy_strict

[ policy_strict ]
# The root CA should only sign intermediate certificates that match.
# See the POLICY FORMAT section of `man ca`.
countryName = match
stateOrProvinceName = match
organizationName = match
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ policy_loose ]
# Allow the intermediate CA to sign a more diverse range of certificates.
# See the POLICY FORMAT section of the `ca` man page.
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
# Options for the `req` tool (`man req`).
default_bits = 2048
distinguished_name = req_distinguished_name
string_mask = utf8only

# SHA-1 is deprecated, so use SHA-2 instead.
default_md = sha256

# Extension to add when the -x509 option is used.
x509_extensions = v3_ca

[ req_distinguished_name ]
# See <https://en.wikipedia.org/wiki/Certificate_signing_request>.
countryName = Country Name (2 letter code)
stateOrProvinceName = State or Province Name
localityName = Locality Name
0.organizationName = Organization Name
organizationalUnitName = Organizational Unit Name
commonName = Common Name
emailAddress = Email Address

# Optionally, specify some defaults.
countryName_default = GB
stateOrProvinceName_default = England
localityName_default =
0.organizationName_default = Alice Ltd
organizationalUnitName_default =
emailAddress_default =

[ v3_ca ]
# Extensions for a typical CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
# Extensions for a typical intermediate CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ usr_cert ]
# Extensions for client certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

[ server_cert ]
# Extensions for server certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[ crl_ext ]
# Extension for CRLs (`man x509v3_config`).
authorityKeyIdentifier=keyid:always

[ ocsp ]
# Extension for OCSP signing certificates (`man ocsp`).
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature
extendedKeyUsage = critical, OCSPSigning
```

#### openssl.cnf

```ini

```

#### create-ca.sh

```sh
#!/bin/bash
# create-ca.sh

# Create folder structure for PKI.
mkdir -p pki/{cacert,private,csr,certs}
chmod 700 pki

# Generate Root CA private key.
openssl genrsa -out pki/private/rootCA.key 4096
chmod 600 pki/private/rootCA.key

# Gererate self-signed Root CA with a 10 year validity.
openssl req -x509 -new -nodes -sha256 -days 3650 \
  -extensions v3_ca -config openssl.cnf \
  -subj "/C=NL/O=Groveld VPN/CN=Groveld VPN Root CA" \
  -key pki/private/rootCA.key \
  -out pki/cacert/rootCA.crt
```

#### create-server.sh

```sh
#!/bin/bash
# create-server.sh

if [ $# -ne 1 ]; then
  echo "Usage: $0 <common_name>"
  exit 1
fi

NAME=$1

# Generate server private key.
openssl genrsa -out pki/private/$NAME.key 2048

# Gererate server signing request.
openssl req -new -sha256 \
  -extensions v3_req -config openssl.cnf \
  -key pki/private/$NAME.key \
  -out pki/csr/$NAME.csr

# Gererate server signing request.
openssl req -new -sha256 \
  -extensions v3_req -config openssl.cnf \
  -subj "/C=NL/O=Groveld VPN/CN=$NAME" \
  -key pki/private/$NAME.key \
  -out pki/csr/$NAME.csr
```









**Attention:** this is the key used to sign the certificate requests, anyone holding this can sign certificates on your behalf. So keep it in a safe place!

```bash
openssl genrsa -out groveldCA.key 4096
```

If you want a password protected key just add the option: `-des3`

### Create and self-sign the Root Certificate

Here we use our root key to create the root certificate that needs to be distributed in all the computers that have to trust us.

```bash
openssl req -x509 -new -nodes -sha256 -key groveldCA.key -subj "/C=NL/O=Groveld/CN=Groveld Root CA 1" -out groveldCA.crt -days 3650
```

#### Verify the certificate's content

```
openssl x509 -in groveldCA.crt -text -noout
```

## Create a certificate (Done for each server)

This procedure needs to be followed for each server/appliance that needs a trusted certificate from our CA

### Create the certificate key

```bash
openssl genrsa -out home.groveld.com.key 2048
```

### Create the signing (csr)

The certificate signing request is where you specify the details for the certificate you want to generate.
This request will be processed by the owner of the Root key (you in this case since you create it earlier) to generate the certificate.

**Important:** Please mind that while creating the signign request is important to specify the `Common Name` providing the IP address or domain name for the service, otherwise the certificate cannot be verified.

I will describe two ways to generate:

#### Method A (Interactive)

If you generate the csr in this way, openssl will ask you questions about the certificate to generate like the organization details and the `Common Name` (CN) that is the web address you are creating the certificate for, e.g `home.groveld.com`.

```bash
openssl req -new -sha256 -key home.groveld.com.key -out home.groveld.com.csr
```

#### Method B (One Liner)

This method generates the same output as Method A but it's suitable for use in your automation :) .

```
openssl req -new -sha256 -key home.groveld.com.key -subj "/C=NL/O=Groveld/CN=home.groveld.com" -out home.groveld.com.csr
```

If you need to pass additional config you can use the `-config` parameter, here for example I want to add alternative names to my certificate.

```
openssl req -new -sha256 \
    -key home.groveld.com.key \
    -subj "/C=NL/O=Groveld/CN=home.groveld.com" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:groveld.com,DNS:office.groveld.com")) \
    -out home.groveld.com.csr
```


### Verify the csr's content

```
openssl req -in home.groveld.com.csr -noout -text
```

## Generate the certificate using the `home.groveld.com` csr and key along with the CA Root key

```
openssl x509 -req -sha256 -in home.groveld.com.csr -CA groveldCA.crt -CAkey groveldCA.key -CAcreateserial -out home.groveld.com.crt -days 365
```

### Verify the certificate's content

```
openssl x509 -in home.groveld.com.crt -text -noout
```

[1]: https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ikev2-vpn-server-with-strongswan-on-ubuntu-18-04-2
[2]: https://serverfault.com/questions/536092/strongswan-ikev2-windows-7-agile-vpn-what-is-causing-error-13801