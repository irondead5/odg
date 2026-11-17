import type {
  CatalogItemDefinition,
  DiagramId,
  DocumentId,
  OdgBlueprintConfig
} from './types.js';

export const DIAGRAM_DEFINITIONS: Record<DiagramId, CatalogItemDefinition> = {
  erd: {
    id: 'erd',
    name: 'ERD (Entity-Relationship Diagram)',
    description: 'Tablas, columnas, PK/FK y relaciones de base de datos',
    section: 'diagrams',
    recommended: true
  },
  use_cases: {
    id: 'use_cases',
    name: 'Casos de Uso (Use Cases)',
    description: 'Actores y roles mapeados contra las acciones del sistema',
    section: 'diagrams',
    recommended: true
  },
  c4_context: {
    id: 'c4_context',
    name: 'C4 Context & Containers',
    description: 'Límites del sistema, contenedores internos y APIs externas',
    section: 'diagrams',
    recommended: true
  },
  sequence_flows: {
    id: 'sequence_flows',
    name: 'Flujos de Secuencia',
    description: 'Paso a paso de endpoints y flujos de negocio críticos',
    section: 'diagrams',
    recommended: true
  },
  state_machines: {
    id: 'state_machines',
    name: 'Máquinas de Estado (Statecharts)',
    description: 'Ciclos de vida y transiciones de entidades con estados',
    section: 'diagrams',
    recommended: false
  },
  class_domain: {
    id: 'class_domain',
    name: 'Diagrama de Clases / Dominio',
    description: 'Entidades, herencia, interfaces e inyección de dependencias',
    section: 'diagrams',
    recommended: false
  },
  event_flows: {
    id: 'event_flows',
    name: 'Arquitectura de Eventos',
    description: 'Productores, colas, webhooks y consumidores asíncronos',
    section: 'diagrams',
    recommended: false
  },
  infra_topology: {
    id: 'infra_topology',
    name: 'Topología de Infraestructura',
    description: 'Contenedores Docker, cloud y pipelines de despliegue',
    section: 'diagrams',
    recommended: false
  }
};

export const DOCUMENT_DEFINITIONS: Record<DocumentId, CatalogItemDefinition> = {
  technical_sow: {
    id: 'technical_sow',
    name: 'SOW Técnico (Scope of Work)',
    description: 'Alcance técnico implementado, integraciones y límites del sistema',
    section: 'documents',
    recommended: true
  },
  requirements_srs: {
    id: 'requirements_srs',
    name: 'Documento de Requerimientos (SRS / PRD)',
    description: 'Requerimientos funcionales (RF), no funcionales y reglas de negocio',
    section: 'documents',
    recommended: true
  },
  module_specs: {
    id: 'module_specs',
    name: 'Especificación por Módulo',
    description: 'Arquitectura interna, responsabilidades e invariantes de cada módulo',
    section: 'documents',
    recommended: true
  },
  api_contracts: {
    id: 'api_contracts',
    name: 'Catálogo de APIs & Contratos',
    description: 'Endpoints REST/GraphQL, payloads de entrada/salida y auth guards',
    section: 'documents',
    recommended: true
  },
  data_dictionary: {
    id: 'data_dictionary',
    name: 'Diccionario de Datos',
    description: 'Detalle de tablas, tipos de columnas, índices y significado de campos',
    section: 'documents',
    recommended: true
  },
  env_runbook: {
    id: 'env_runbook',
    name: 'Runbook Operacional & Env Vars',
    description: 'Variables de entorno detectadas, secretos y guía de arranque',
    section: 'documents',
    recommended: true
  },
  inferred_adrs: {
    id: 'inferred_adrs',
    name: 'ADRs Inferidos',
    description: 'Decisiones de arquitectura deducidas del código y dependencias',
    section: 'documents',
    recommended: false
  },
  tech_debt_audit: {
    id: 'tech_debt_audit',
    name: 'Auditoría de Deuda Técnica',
    description: 'Complejidad ciclomática, acoplamiento y cuellos de botella',
    section: 'documents',
    recommended: false
  },
  security_matrix: {
    id: 'security_matrix',
    name: 'Matriz de Seguridad & Amenazas (STRIDE)',
    description: 'Endpoints sin auth, datos sensibles (PII) y superficie de ataque',
    section: 'documents',
    recommended: false
  }
};

export function createDefaultBlueprint(
  preset: OdgBlueprintConfig['preset'] = 'recommended'
): OdgBlueprintConfig {
  const isEnterprise = preset === 'enterprise';
  const isMvp = preset === 'mvp';

  return {
    version: '1.0.0',
    preset,
    aiClis: ['agy', 'claude', 'github-copilot'],
    knowledgeBase: {
      sweepMode: 'auto_zero_token',
      useAstStubs: true,
      dualMarkdownAndUiLinks: true,
      linkCategories: {
        feature_thread: true,
        module_deps: true,
        sow_traceability: true,
        governance_risks: true
      }
    },
    hooks: {
      gitPostCommit: false,
      agyHook: false,
      claudeHook: false,
      codexHook: false
    },
    diagrams: {
      erd: true,
      use_cases: isMvp ? false : true,
      c4_context: true,
      sequence_flows: isMvp ? false : true,
      state_machines: isEnterprise,
      class_domain: isEnterprise,
      event_flows: isEnterprise,
      infra_topology: isEnterprise
    },
    documents: {
      technical_sow: true,
      requirements_srs: isMvp ? false : true,
      module_specs: true,
      api_contracts: isMvp ? false : true,
      data_dictionary: isMvp ? false : true,
      env_runbook: true,
      inferred_adrs: isEnterprise,
      tech_debt_audit: isEnterprise,
      security_matrix: isEnterprise
    }
  };
}
