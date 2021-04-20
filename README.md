## Instructions

unit testing for certificate templates
text file \* json based
otros, no sabemos

    json based certificates
      validate against json schemas


    njk focused tests

.
day in the life of a template developer
developer receives example payload
developer studies structure and extracts fields that will be required to be handled as input
developer identifies non-user data fields
developer creates formdata object(s) in order to cover distinct uses cases for this template \* data format must be created in accordance with what digitalpen / docker's rest api can provide / consume
developer creates NJK template
developer runs test suite tools
toolset uses
json-schemas
nunjuck pipeline
json-ld validator
fixes whenever an error pops
commits work
end

.

/templates/vc/
/commonpass/
nuevo-certificado-pcr-nt.njk
nuevo-certificado2-pcr-nt.njk
nuevo-certificado3-pcr-nt.njk
nuevo-certificado4-pcr-nt.njk
/certus/
nuevo-certificado-pcr-nt.njk

/templates/jws/
/commonpass/
nuevo-certificado-tcp-pcr-nt.njk
/acme/
nuevo-certificado-tcp-pcr-nt.njk
/certus/
nuevo-certificado-tcp-pcr-nt.njk

/fixtures/vc/
commonpass/
nuevo-certificado-pcr-nt/
default.json
basic.json
no_passport_number.json
curp.json
drivers_license.json
special_name.json
certus/
nuevo-certificado-pcr-nt/
default.json
basic.json
no_passport_number.json
curp.json
drivers_license.json
special_name.json
certus_case_1.json
certus_case_2.json
certus_case_3.json
certus_case_4.json
certus_case_5.json

=========
vc_runner.js
traverse /templates/vc/
for each template found then
create test group - describe('tests for template <template_filename>')
load fixtures from /fixtures/vc/<template_filename>/
instantiate test case - describe('fixture <fixture_filename> for template <template_filename>')

abstract_test_case( template, fixture ) {
prepare njk context
populate 'formdata' from fixture
call render on template, passing context
JSON.parse(<template_output>)
validate json-ld well-formedness
// Check $.credentialSubject against json-schema
}

=========
jws_runner.js
traverse /templates/jws/
for each template found then
create test group - describe('tests for template <template_filename>')
load fixtures from /fixtures/vc/<template_filename>/
instantiate test case - describe('fixture <fixture_filename> for template <template_filename>')

abstract_test_case( template, fixture ) {
prepare njk context
populate 'formdata' from fixture
call render on template, passing context
JSON.parse(<template_output>)
use jwt library to parse claims in token
// Check $.credentialSubject against json-schema
}

## UI Context

This is the information available that is fed as context to nunjucks templates

{
logo: base64,
template: {
id: template.id,
name: template.name,
type: template.type,
description: template.description,
context: template.context,
createdAt: template.createdAt?.toISOString() || ''
},
organization: {
id: org.id,
name: org.registeredName,
legalRepresentativeName:
org.legalRepresentatives[0]?.givenName + ' ' + org.legalRepresentatives[0]?.familyName,
city: org.location.city,
state: org.location.state,
country: org.location.country
},
digitalPen: {
id: pen.id,
legalName: pen.legalName,
legalRepresentativeId: pen.legalRepresentativeId
},
certificate: {
serialNumber: pen.certificate.serialNumber,
createdAt: pen.certificate.createdAt,
expirationDate: pen.certificate.expirationDate,
validFrom: pen.certificate.validFrom,
authorityKeyIdentifier: pen.certificate.authorityKeyIdentifier,
subjectKeyIdentifier: pen.certificate.subjectKeyIdentifier
},
issuer: {
id: auth.user.idTokenParsed.sub,
firstname: auth.user.idTokenParsed.family_name,
lastname: auth.user.idTokenParsed.given_name
},
credential: {
id: uuidv4()
},
subject: {
id: uuidv4(),
formData: {
...claims.reduce<Record<string, unknown>>((acc, cur) => ({ ...acc, [cur.claim]: cur.value }), {}),
photo: ''
}
},
baseUrl: window.location.host.replace(/digitalpen\./, ''),
evidence: {}
};
