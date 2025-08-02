import { Project } from "@draw/models";
import { db } from "../db";

export const projectService = {
  getProjects(orgId: string): Promise<Project[]> {
    return db.projects.where('organisationId').equals(orgId).toArray();
  },
};