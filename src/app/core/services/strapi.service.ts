import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Generic Strapi API response for collections */
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** Strapi API response for single types */
export interface StrapiSingleResponse<T> {
  data: T;
}

/** Strapi media asset */
export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: Record<string, { url: string; width: number; height: number }>;
  };
}

/**
 * Service for interacting with the Strapi CMS REST API.
 * Provides methods to fetch single types and collections.
 */
@Injectable({ providedIn: 'root' })
export class StrapiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.strapiUrl}/api`;

  /**
   * Fetch a single-type entry from Strapi
   * @param contentType - The Strapi content type name (e.g., 'hero', 'podcast')
   * @returns Observable of the single-type response
   */
  public getSingle<T>(contentType: string): Observable<StrapiSingleResponse<T>> {
    return this.http.get<StrapiSingleResponse<T>>(`${this.baseUrl}/${contentType}?populate=*`);
  }

  /**
   * Fetch a collection from Strapi
   * @param contentType - The Strapi content type name (e.g., 'services', 'testimonials')
   * @returns Observable of the collection response
   */
  public getCollection<T>(contentType: string): Observable<StrapiResponse<T[]>> {
    return this.http.get<StrapiResponse<T[]>>(`${this.baseUrl}/${contentType}?populate=*`);
  }
}
