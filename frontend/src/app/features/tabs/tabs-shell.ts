import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { filter, map } from 'rxjs';
import {
  NavigationBar,
  type NavDestination,
} from '../../shared/components/navigation-bar/navigation-bar';

/** Pestañas Inici · Calendari · Tasques · IA, con la barra de navegación fija. */
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
    const m = /^\/tabs\/(home|calendar|tasks|ai)/.exec(this.router.url);
    return (m?.[1] as NavDestination) ?? null;
  }
}
