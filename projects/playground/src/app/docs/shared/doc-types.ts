export interface DocSection {
  id: string;
  label: string;
}

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

export interface ApiMethod {
  name: string;
  signature: string;
  description?: string;
}

// ── Doc shell API reference types ───────────────────────────────────────────
// Used by <app-doc-shell> to render the "API" resource (Properties / Emitters /
// Templates / Interfaces), mirroring the PrimeNG docs layout.

export type DocApiProperty = ApiProp;

export interface DocApiEmitter {
  name: string;
  type: string;
  description?: string;
}

export interface DocApiTemplate {
  name: string;
  description?: string;
}

export interface DocApiInterfaceField {
  name: string;
  type: string;
  description?: string;
}

export interface DocApiInterface {
  name: string;
  fields: DocApiInterfaceField[];
}
