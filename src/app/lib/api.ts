// src/app/lib/api.ts
import { supabase } from './supabase';
import type { Project, Issue } from './mockData'; // Update these types to match DB schema if needed

export const api = {
  // Fetch all projects for the Dashboard
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('last_scan', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Fetch a single project and its related issues for the Analysis view
  async getProjectAnalysis(projectId: string) {
    const [projectResult, issuesResult] = await Promise.all([
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('issues').select('*').eq('project_id', projectId)
    ]);

    if (projectResult.error) throw projectResult.error;
    if (issuesResult.error) throw issuesResult.error;

    return {
      project: projectResult.data,
      issues: issuesResult.data
    };
  },

  // Insert a new scan result
  async saveScanResult(projectData: Partial<Project>, issues: Partial<Issue>[]) {
    // 1. Insert Project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) throw projectError;

    // 2. Insert related issues
    if (issues.length > 0) {
      const issuesWithProjectId = issues.map(issue => ({
        ...issue,
        project_id: project.id
      }));

      const { error: issuesError } = await supabase
        .from('issues')
        .insert(issuesWithProjectId);

      if (issuesError) throw issuesError;
    }

    return project;
  }
};