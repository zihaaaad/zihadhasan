import { CMSService } from "@/lib/cms-service";
import { applyProjectCopyOverrides } from "@/lib/services/project-service";
import { ProjectsClient } from "./projects-client";

/**
 * Fetches the CMS case studies at build time so they land in the prerendered
 * HTML. Previously this whole page was a client component that only loaded the
 * project list after a Firestore round trip in the browser, which meant
 * crawlers saw an empty "featured" section - the GitHub tab rendered fine
 * because it reads a static JSON file baked in at build.
 *
 * ProjectsClient still refreshes in the background, so projects added since the
 * last build are not stranded until the next deploy.
 */
export default async function ProjectsPage() {
  const projects = await CMSService.getProjects()
    .then(applyProjectCopyOverrides)
    .catch((error) => {
      console.error("[ProjectsPage] build-time fetch failed:", error);
      return [];
    });

  return <ProjectsClient initialProjects={projects} />;
}
