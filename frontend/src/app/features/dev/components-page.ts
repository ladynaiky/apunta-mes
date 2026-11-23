import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { apiErrors, ca } from '../../i18n/ca';
import { Badge } from '../../shared/components/badge/badge';
import { Button } from '../../shared/components/button/button';
import { Checkbox } from '../../shared/components/checkbox/checkbox';
import { Chip } from '../../shared/components/chip/chip';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Fab } from '../../shared/components/fab/fab';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { NavListItem } from '../../shared/components/nav-list-item/nav-list-item';
import { NavigationBar } from '../../shared/components/navigation-bar/navigation-bar';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { SubjectDot } from '../../shared/components/subject-dot/subject-dot';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TextField } from '../../shared/components/text-field/text-field';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import type { SubjectColorToken } from '../../shared/utils/task-title';

/**
 * Página de desarrollo con todos los componentes compartidos y sus estados.
 * Sirve para revisarlos contra el Design System a 412 y a 360 dp.
 */
@Component({
  selector: 'ap-components-page',
  imports: [
    FormsModule,
    IonContent,
    Badge,
    Button,
    Checkbox,
    Chip,
    Dialog,
    Fab,
    IconButton,
    NavListItem,
    NavigationBar,
    Select,
    StateMessage,
    SubjectDot,
    TaskRow,
    TextField,
    TopBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-page.html',
  styleUrl: './components-page.scss',
})
export class ComponentsPage {
  private readonly snackbar = inject(SnackbarService);
  protected readonly ca = ca;

  protected readonly subjects: { name: string; color: SubjectColorToken }[] = [
    { name: 'Castellà', color: 'taronja' },
    { name: 'Català', color: 'groc' },
    { name: 'Anglès', color: 'lila' },
    { name: 'Socials', color: 'verd' },
    { name: 'Plàstica', color: 'turquesa' },
    { name: 'Música', color: 'rosa' },
    { name: 'Mates', color: 'blau' },
  ];
  protected readonly roles: SelectOption[] = [
    { value: 'student', label: 'Alumne' },
    { value: 'parent', label: 'Pares' },
    { value: 'teacher', label: 'Profe' },
  ];

  protected readonly selectedChip = signal('Mates');
  protected readonly checked = signal(true);
  protected readonly doneMates = signal(false);
  protected readonly email = signal('nom@exemple');
  protected readonly password = signal('');
  protected readonly role = signal<string | null>(null);
  protected readonly dialogOpen = signal(false);
  protected readonly emailError = apiErrors['email.invalid'];
  protected readonly roleError = apiErrors['role.required'];

  protected showSnackbar(): void {
    this.snackbar.show('Tasca esborrada.', { actionLabel: ca.common.undo, action: () => this.snackbar.show('Tasca desada') });
  }
}
