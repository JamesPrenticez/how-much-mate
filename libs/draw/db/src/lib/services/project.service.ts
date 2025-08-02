import { Project } from "@draw/models";
import { db } from "../db";

export const projectService = {
  async getProjects(orgId: string): Promise<Project[]> {

    const projects = await db.projects
      .where('organisationId')
      .equals(orgId)
      .toArray();

    return projects.sort((a, b) => a.code.localeCompare(b.code));
  },
};