import { VehicleTrackingComponent } from './pages/vehicle-tracking/vehicle-tracking.component';
import { CameraDashboardComponent } from './pages/cameraid-dashboard/cameraid-dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { EmailDistributionComponent } from './pages/email-distribution/email-distribution.component';

export const routes: Routes = [
    {path: '', redirectTo: 'main-dashboard', pathMatch: 'full'},
    { path: 'main-dashboard', component: MainDashboardComponent },
    { path: 'cameraid-dashboard', component: CameraDashboardComponent },
    {
        path: '',
        component: PagesComponent, children: [
            { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' } },
            { path: 'reports', component: ReportsComponent, data: { breadcrumb: 'Reports' } },
            { path: 'tracking-vehicle', component: VehicleTrackingComponent, data: { breadcrumb: 'Tracking Vehicle' } },
            { path: 'email-distribution', component: EmailDistributionComponent, data: { breadcrumb: 'Email Distribution' } },
            //{ path: 'Live Tracking', component: }
            { path: 'covid19', loadChildren: () => import('./pages/covid/covid.module').then(m => m.CovidModule), data: { breadcrumb: 'Covid-19 Updates' } },

            { path: 'charts', loadChildren: () => import('./pages/charts/charts.module').then(m => m.ChartsModule), data: { breadcrumb: 'Charts' } },
            { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } },
            { path: 'search/:name', component: SearchComponent, data: { breadcrumb: 'Search' } }
        ]
    },
    { path: 'reload', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true
});