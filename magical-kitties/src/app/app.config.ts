import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { ApiClient } from './services/apiClient.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi(),
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiClient,
            multi: true,
        },
        provideMarkdown(),
    ]
};
