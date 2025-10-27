import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 30000; // 30 secondes par défaut

  /**
   * Récupère des données du cache ou exécute la fonction si pas en cache
   */
  get<T>(key: string, fallback: () => Observable<T>, ttl: number = this.DEFAULT_TTL): Observable<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.expiresIn) {
      console.log(`Cache hit pour ${key}`);
      return of(cached.data);
    }

    console.log(`Cache miss pour ${key}, exécution de la fonction`);
    return fallback().pipe(
      tap(data => {
        this.cache.set(key, {
          data,
          timestamp: now,
          expiresIn: ttl
        });
      })
    );
  }

  /**
   * Met à jour le cache avec de nouvelles données
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl
    });
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Supprime les entrées expirées du cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp >= item.expiresIn) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtient la taille du cache
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Obtient les clés du cache
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}
