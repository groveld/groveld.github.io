# Self Signed Certificate with Custom Root CA

## Create Root CA (Done once)

### Create Root Key

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

```bash
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

#### Method B (one-liner)

This method generates the same output as Method A but it's suitable for use in your automation :) .

```bash
openssl req -new -sha256 -key home.groveld.com.key -subj "/C=NL/O=Groveld/CN=home.groveld.com" -out home.groveld.com.csr
```

If you need to pass additional config you can use the `-config` parameter, here for example I want to add alternative names to my certificate.

```bash
openssl req -new -sha256 \
    -key home.groveld.com.key \
    -subj "/C=NL/O=Groveld/CN=home.groveld.com" \
    -reqexts SAN \
    -config <(cat /etc/ssl/openssl.cnf \
        <(printf "\n[SAN]\nsubjectAltName=DNS:groveld.com,DNS:office.groveld.com")) \
    -out home.groveld.com.csr
```

### Verify the csr's content

```bash
openssl req -in home.groveld.com.csr -noout -text
```

## Generate the certificate using the `home.groveld.com` csr and key along with the CA Root key

```bash
openssl x509 -req -sha256 -in home.groveld.com.csr -CA groveldCA.crt -CAkey groveldCA.key -CAcreateserial -out home.groveld.com.crt -days 365
```

### Verify the certificate's content

```bash
openssl x509 -in home.groveld.com.crt -text -noout
```

[DO REFERENCE](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ikev2-vpn-server-with-strongswan-on-ubuntu-18-04-2)
https://serverfault.com/questions/536092/strongswan-ikev2-windows-7-agile-vpn-what-is-causing-error-13801
