export type DiagramId =
  | 'erd'
  | 'use_cases'
  | 'c4_context'
  | 'sequence_flows'
  | 'state_machines'
  | 'class_domain'
  | 'event_flows'
  | 'infra_topology';

export type DocumentId =
  | 'technical_sow'
  | 'requirements_srs'
  | 'module_specs'
  | 'api_contracts'
  | 'data_dictionary'
  | 'env_runbook'
  | 'inferred_adrs'
  | 'tech_debt_audit'
  | 'security_matrix';

export type SweepMode = 'auto_zero_token' | 'manual_sweep' | 'hybrid_ai_sweep';

export type LinkCategoryId =
  | 'feature_thread'
  | 'module_deps'
  | 'sow_traceability'
  | 'governance_risks';

export type AiToolId =
  | 'agy'
  | 'claude'
  | 'github-copilot'
  | 'codex'
  | 'gemini'
  | 'cursor'
  | 'windsurf'
  | 'opencode'
  | 'cline'
  | 'roocode'
  | 'kilocode'
  | 'amazon-q'
  | 'augment'
  | 'continue'
  | 'universal';

export interface CatalogItemDefinition {
  id: string;
  name: string;
  description: string;
  section: 'diagrams' | 'documents';
  recommended: boolean;
  enterpriseOnly?: boolean;
}

export interface OdgBlueprintConfig {
  version: string;
  preset: 'recommended' | 'enterprise' | 'mvp' | 'custom';
  aiClis: AiToolId[];
  knowledgeBase: {
    sweepMode: SweepMode;
    useAstStubs: boolean;
    dualMarkdownAndUiLinks: boolean;
    linkCategories: Record<LinkCategoryId, boolean>;
  };
  hooks: {
    gitPostCommit: boolean;
    agyHook: boolean;
    claudeHook: boolean;
    codexHook: boolean;
  };
  diagrams: Record<DiagramId, boolean>;
  documents: Record<DocumentId, boolean>;
}
