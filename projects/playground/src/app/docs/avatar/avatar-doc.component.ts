import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiAvatarComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-avatar-doc',
  imports: [CuiAvatarComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './avatar-doc.component.html',
  styleUrl: './avatar-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'sizes',    label: 'Sizes' },
    { id: 'shapes',   label: 'Shapes' },
    { id: 'initials', label: 'Initials fallback' },
    { id: 'status',   label: 'Status indicator' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'src',       type: 'string | null', default: 'null', description: 'Image URL. Falls back to initials if unset or on load error.' },
    { name: 'name',      type: 'string | null', default: 'null', description: 'Full name used to derive initials and the default aria-label.' },
    { name: 'size',      type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`, default: `'md'`, description: 'Avatar diameter.' },
    { name: 'shape',     type: `'circle' | 'rounded' | 'square'`, default: `'circle'`, description: 'Avatar shape.' },
    { name: 'status',    type: `'online' | 'offline' | 'away' | 'busy' | null`, default: 'null', description: 'Renders a status dot in the corner when set.' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', description: 'Accessible label; falls back to name.' },
  ];
}
