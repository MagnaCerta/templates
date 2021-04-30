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
    resourcesBaseDir + "/njkTemplates/verifierApp/" + path.basename(__dirname);
  const vcFixturesPath =
    resourcesBaseDir + "/fixtures/verifierApp/" + path.basename(__dirname);
  const templatesFullPaths = templatesLoader(
    path.join(__dirname, vcTemplatesPath)
  );

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
        const credential = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

        // Render template
        const rawVc = env.render(templatePath, { credential });

        // Parse generated vc
        const parsedVc = JSON.parse(rawVc);

        console.log(parsedVc);
      });
    }
  });
});
