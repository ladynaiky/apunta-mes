import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { filter, map } from 'rxjs';
import {
  NavigationBar,
  type NavDestination,
} from '../../shared/components/navigation-bar/navigation-bar';
import { originTab } from '../../shared/utils/origin';

/**
 * Marco de la app con sesión: todas las pantallas (niveles 1, 2 y 3) con la
 * barra de navegación fija debajo, como en el diseño. En las pestañas se
 * marca su destino; en el resto, el de origen (`?from=`).
 */
@Component({
  selector: 'ap-tabs-shell',
  imports: [IonRouterOutlet, NavigationBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="outlet"><ion-router-outlet /></div>
    <ap-navigation-bar [active]="active()" />
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    .outlet { position: relative; flex: 1; }
  `,
})
export class TabsShell {
  private readonly router = inject(Router);
  protected readonly active = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.current()),
    ),
    { initialValue: this.current() },
  );

  private current(): NavDestination | null {
    const tree = this.router.parseUrl(this.router.url);
    const m = /^\/tabs\/(home|calendar|tasks|ai)/.exec(this.router.url);
    if (m) return m[1] as NavDestination;
    return originTab(tree.queryParams['from']);
  }
}
