import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component'
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authAdminGuard } from './guard/auth-admin.guard'; 

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { 
        path: "dashboard", 
        component: DashboardComponent, 
        canActivate: [authAdminGuard],
        data: { redirectTo: "login" }
    }
];
