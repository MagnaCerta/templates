import templatesLoader from "../../../utils/loader";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { Environment, FileSystemLoader } from "nunjucks";
import { default as dateFilterInstaller } from "../../../utils/dateFilter";
import * as schemas from "../../../schemas/vc/testOrg/schemas";
import { validate } from "../../../utils/schemaValidator";

describe("Templates Unit Tests", () => {
  const resourcesBaseDir = "../../..";
  const vcTemplatesPath =
    resourcesBaseDir + "/njkTemplates/vc/" + path.basename(__dirname);
  const vcFixturesPath =
    resourcesBaseDir + "/fixtures/vc/" + path.basename(__dirname);
  const templatesFullPaths = templatesLoader(
    path.join(__dirname, vcTemplatesPath)
  );
    console.log(vcFixturesPath)
  // Nunjucks instance
  const loader = new FileSystemLoader(path.join(__dirname, vcTemplatesPath));
  const env = new Environment(loader, { autoescape: true });
  dateFilterInstaller(env);

  describe.each(templatesFullPaths)("Test for template: %s", (templatePath) => {
    const fileName = path.basename(templatePath).split(".")[0];
    const fixturesFullPaths = templatesLoader(
      path.join(__dirname, vcFixturesPath, fileName)
    );
    if (fixturesFullPaths.length > 0) {
      test.each(fixturesFullPaths)("Test for fixture %s", (fixturePath) => {
        const now = new Date();
        const formData = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
        const certaContext = {
          template: {
            id: uuidv4(),
            name: fileName,
            type: "",
            description: "",
            context: "",
            createdAt: now.toISOString(),
          },
          organization: {
            id: uuidv4(),
            name: "OrganizationName",
            legalRepresentativeName: "legalRepName",
            city: "cityName",
            state: "cityState",
            country: "countryName",
          },
          digitalPen: {
            id: uuidv4(),
            legalName: "dpLegalName",
            legalRepresentativeId: "dpLegalRepname",
          },
          certificate: {
            serialNumber: uuidv4(),
            createdAt: now.toISOString(),
            expirationDate: now.toISOString(),
            validFrom: "",
            authorityKeyIdentifier: "457cd89d5c3a3c0a9e866119e50ecb6ef97240b0",
            subjectKeyIdentifier: "02c8cd9605206f2726e063819a81d431bdcf9094",
          },
          issuer: {
            id: uuidv4(),
            firstname: "issuerFirstName",
            lastname: "issuerLastName",
          },
          credential: {
            id: uuidv4(),
          },
          subject: {
            id: uuidv4(),
            formData,
          },
          baseUrl: "baseurl.com",
          evidence: {},
        };

        // Render template
        const rawVc = env.render(templatePath, certaContext);

        // Parse generated vc
        const parsedVc = JSON.parse(rawVc);

        // vc schema validation
        //@ts-ignore
        validate(parsedVc, schemas[fileName]);
      });
    }
  });
});
