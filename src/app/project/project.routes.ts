export const projectRoutes = [
    {
        path: 'project/:projectId',
        loadComponent: () => import('./project-page/project-page.component').then(m => m.ProjectPageComponent)
    },
];