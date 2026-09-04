import { MissionPuzzle } from '../types';
import { ALL_TOOLS } from './tools';

export const MISSIONS: MissionPuzzle[] = [
  {
    id: 'mission_1',
    level: 1,
    title: 'Azure Key Vault & The Blind Chatbot',
    subtitle: 'Why AI Models Need Tools to Query Azure Cloud & ADLS Gen 2',
    conceptTaught: 'Perception & Tool Calling in Cloud Infrastructure',
    conceptExplanation:
      'A plain LLM (Chatbot) is isolated in a text prompt box. When asked to access data lake partitions, it hallucinates imaginary SAS tokens or placeholder connection strings. An AI Agent, however, uses dedicated Azure Tools to query Key Vault, retrieve verified cryptographic secrets, and authenticate directly against ADLS Gen 2.',
    objective: 'Retrieve the ADLS Gen 2 connection token from Azure Key Vault and unlock access to the raw-landing-zone storage container.',
    initialPrompt: 'Agent, retrieve the master access key from Azure Key Vault and authenticate access to ADLS Gen 2 container raw-landing-zone.',
    scenarioBackground: 'Azure Cloud Infrastructure — Production Resource Group (rg-data-platform-prod)',
    maxBudget: 6,
    initialEntities: [
      {
        id: 'azure_key_vault',
        name: 'Azure Key Vault (kv-enterprise-prod)',
        type: 'vault',
        statusText: 'Locked with RBAC. Contains secret: "adls-access-token" (Encrypted with HSM).',
        secretData: 'Secret value: "Bearer_tok_adls_7391_sec"',
        properties: { secretFound: false },
      },
      {
        id: 'adls_storage',
        name: 'ADLS Gen 2 (abfss://raw-landing-zone@adlsfinprod)',
        type: 'storage',
        isLocked: true,
        statusText: '401 Unauthorized: Requires verified secret token from Azure Key Vault.',
        properties: { correctCode: '7391' },
      },
      {
        id: 'config_catalog',
        name: 'Data Catalog & Linked Service Metadata',
        type: 'object',
        statusText: 'Lists linked storage accounts and Azure Key Vault URI references.',
        properties: { searched: false },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['get_keyvault_secret', 'query_adls_storage', 'inspect_entity', 'search_area', 'use_keypad', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'A raw chatbot will hallucinate a dummy string like "DefaultEndpointsProtocol=https;AccountName=...". An agent calls `get_keyvault_secret` on kv-enterprise-prod to retrieve token "7391", then authenticates ADLS Gen 2!',
    solutionExplanation:
      'Step 1: Agent inspects the Azure Key Vault resource. Step 2: Agent executes `get_keyvault_secret` to extract "Bearer_tok_adls_7391_sec". Step 3: Agent inputs authentication token "7391" into the ADLS Gen 2 storage endpoint to mount the container. Step 4: Agent verifies goal completion!',
  },
  {
    id: 'mission_2',
    level: 2,
    title: 'The Medallion Pipeline Amnesia Crisis',
    subtitle: 'Multi-Stage Orchestration (ADLS Gen 2 -> Databricks -> ADF -> Synapse DB)',
    conceptTaught: 'State Retention & Working Memory in Data Pipelines',
    conceptExplanation:
      'Every time an AI model generates an action, it relies on context. Without persistent working memory or a scratchpad, an orchestrator agent forgets intermediate batch IDs, cluster outputs, and completed stages—getting trapped in an infinite loop checking the same ADLS container forever.',
    objective: 'Complete the Medallion Data Pipeline in exact sequence: 1) Verify ADLS Gen 2 bronze parquet files, 2) Trigger Databricks Spark job for Silver Delta Lake merge, 3) Run Azure Data Factory (ADF) pipeline to publish into Synapse DB.',
    initialPrompt: 'Execute end-to-end Medallion ingestion: ADLS Gen 2 -> Databricks Delta -> Azure Data Factory -> Synapse DB.',
    scenarioBackground: 'Enterprise Cloud Lakehouse — High-Frequency Financial Ingestion Architecture',
    maxBudget: 7,
    initialEntities: [
      {
        id: 'adls_bronze',
        name: 'ADLS Gen 2 (abfss://bronze@lakehouse/daily_sales.parquet)',
        type: 'storage',
        statusText: 'Landing batch ready: 48,200 Parquet records pending ingestion.',
        properties: { recordCount: 48200 },
      },
      {
        id: 'databricks_spark',
        name: 'Databricks Cluster (etl-medallion-runner)',
        type: 'cluster',
        statusText: 'Cluster ready. PySpark notebook: /Shared/ETL_Bronze_To_Silver_Delta (Target: 142 partitions).',
        properties: { target: 142, current: 98 },
      },
      {
        id: 'adf_pipeline',
        name: 'Azure Data Factory (pl_load_synapse_dw)',
        type: 'pipeline',
        statusText: 'QUEUED: Awaiting Databricks Delta Lake Silver verification before Synapse DB copy.',
        properties: { state: 'QUEUED' },
      },
      {
        id: 'synapse_dw',
        name: 'Synapse DB (Dedicated SQL Pool: fact_daily_sales)',
        type: 'database',
        statusText: 'Standing by for final ADF bulk load and dimension reconciliation.',
        properties: { status: 'STANDBY' },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['query_adls_storage', 'run_databricks_job', 'trigger_adf_pipeline', 'execute_synapse_sql', 'write_scratchpad', 'read_sensor', 'toggle_switch', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'If Memory is turned OFF ("NONE"), watch the agent verify the ADLS Gen 2 files, forget it did so on the next tick, and re-query ADLS forever! Turn on "SCRATCHPAD" so it tracks stage completions.',
    solutionExplanation:
      'With Scratchpad enabled, the agent logs { adls_verified: true, batch_id: "batch_48200" }. Next, it triggers Databricks Spark to produce clean Silver Delta tables. Finally, it triggers the Azure Data Factory pipeline to load Synapse DB, validating all 48,200 records!',
  },
  {
    id: 'mission_3',
    level: 3,
    title: 'The Rogue Synapse Drop & Human-in-the-Loop',
    subtitle: 'Safety Guardrails & Authorization for Synapse DB & ADLS Gen 2',
    conceptTaught: 'Safety Guardrails & Supervised Autonomy',
    conceptExplanation:
      'Autonomous agents are relentless optimizers. Given an urgent goal like "free up data warehouse storage", an unconstrained agent might pick the fastest, most destructive command: running DROP TABLE on the historical Synapse DB warehouse! Human-in-the-Loop (HITL) safeguards intercept dangerous DDL/DML actions and enforce safe alternatives.',
    objective: 'Free up warehouse storage quota WITHOUT dropping business-critical Synapse DB tables or destroying compliance archives.',
    initialPrompt: 'Resolve critical storage capacity alert: Synapse DB Dedicated SQL Pool at 98% DWU quota.',
    scenarioBackground: 'Azure Synapse Analytics & ADLS Storage Cluster — Financial Reporting DW',
    maxBudget: 5,
    requiresHumanApproval: true,
    initialEntities: [
      {
        id: 'synapse_financials',
        name: 'Synapse DB (fact_financial_transactions_historical - 500 GB)',
        type: 'database',
        statusText: 'CRITICAL: Contains 7 years of regulatory SEC transaction records.',
        properties: { isCritical: true, size: '500 GB' },
      },
      {
        id: 'adls_staging_blobs',
        name: 'ADLS Gen 2 (abfss://staging@datalake/uncompressed_logs/ - 260 GB)',
        type: 'storage',
        statusText: 'Old raw JSON pipeline ingestion logs from 6 months ago. Safe to compress/archive.',
        properties: { isCritical: false, size: '260 GB' },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['inspect_entity', 'execute_terminal', 'archive_adls_data', 'compress_logs', 'execute_synapse_sql', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'The agent will propose executing a catastrophic command like `DROP TABLE synapse.fact_financial_transactions_historical` because it is 500 GB! As Human Supervisor, REJECT that dangerous action, forcing the agent to compress ADLS Gen 2 staging logs instead.',
    solutionExplanation:
      'When the agent proposes deleting the Synapse historical table, the Human-in-the-Loop gate pauses execution. The user clicks REJECT. The agent observes the rejection, reasons about safe alternatives, and invokes `archive_adls_data` to compress 260 GB of staging files to cold tier, safely resolving the quota alert!',
  },
  {
    id: 'mission_4',
    level: 4,
    title: 'Databricks Spot Eviction & ADF Self-Healing',
    subtitle: 'Error Recovery & The ReAct Loop in Azure Pipelines',
    conceptTaught: 'The ReAct Loop & Cloud Pipeline Self-Correction',
    conceptExplanation:
      'In production cloud pipelines, Azure Data Factory or Databricks jobs can suffer from transient Spot instance evictions, cluster OOMs, or API 503 errors. A static pipeline script crashes and terminates. An AI Agent using the ReAct loop reads the error observation, reasons about a fallback compute pool, and automatically reruns the pipeline.',
    objective: 'Complete Azure Data Factory ingestion into Synapse DB when the primary Databricks Spot cluster is terminated mid-job.',
    initialPrompt: 'Ensure daily telemetry data is transformed in Databricks and delivered into Synapse DB.',
    scenarioBackground: 'Azure Data Platform — High-Throughput IoT Ingestion Infrastructure',
    maxBudget: 6,
    initialEntities: [
      {
        id: 'databricks_spot_cluster',
        name: 'Databricks Spot Cluster (spot-etl-worker-01)',
        type: 'cluster',
        statusText: 'TERMINATED: Spot instance evicted by Azure Cloud Provider (Error 503 Unavailable).',
        properties: { faulty: true },
      },
      {
        id: 'databricks_ondemand_pool',
        name: 'Databricks On-Demand Fallback Pool (ondemand-compute-pool)',
        type: 'cluster',
        statusText: 'STANDBY: High-availability on-demand single-node cluster ready for failover.',
        properties: { faulty: false },
      },
      {
        id: 'synapse_target',
        name: 'Synapse DB (gold_iot_device_telemetry)',
        type: 'database',
        statusText: 'Awaiting clean Silver-to-Gold Delta aggregation from Databricks.',
        properties: { loaded: false },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['inspect_entity', 'execute_terminal', 'run_databricks_job', 'trigger_adf_pipeline', 'execute_synapse_sql', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'Watch the agent trigger the primary Databricks Spot cluster, receive an Error 503 Spot Eviction observation, reflect on the failure, and fail over seamlessly to the On-Demand Fallback Pool.',
    solutionExplanation:
      'The agent triggers `run_databricks_job` on the Spot cluster, observing `ERROR 503: SpotInstanceUnavailable`. Rather than failing the pipeline, the agent reflects, selects the on-demand fallback cluster, reruns the PySpark notebook, and successfully populates Synapse DB!',
  },
  {
    id: 'mission_5',
    level: 5,
    title: 'Enterprise Data Mesh Multi-Agent Swarm',
    subtitle: 'Cross-Cloud Specialization Across All 5 Azure Stacks',
    conceptTaught: 'Multi-Agent Swarm Architecture & Delegation',
    conceptExplanation:
      'In modern enterprise lakehouses, no single agent does everything. A Lead Coordinator Agent breaks a high-level data mesh goal into specialized roles: 1) Security & Storage Agent (Key Vault + ADLS Gen 2), 2) Spark Engineer Agent (Databricks Delta Lake), and 3) Warehouse & Ingestion Agent (Azure Data Factory + Synapse DB).',
    objective: 'Orchestrate an end-to-end data pipeline across Key Vault, ADLS Gen 2, Databricks, Azure Data Factory, and Synapse DB by delegating to specialist agents.',
    initialPrompt: 'Coordinate the Data Platform swarm to authenticate, process, and publish the enterprise quarterly dataset.',
    scenarioBackground: 'Enterprise Cloud Data Mesh — Azure Global Financial Hub',
    maxBudget: 7,
    initialEntities: [
      {
        id: 'enterprise_mesh',
        name: 'Azure Enterprise Data Mesh Ecosystem',
        type: 'pipeline',
        statusText: 'Cross-stack synchronization required across Key Vault, ADLS Gen 2, Databricks, ADF, and Synapse DB.',
        properties: { locked: true, phase: 'PENDING_DELEGATION' },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['delegate_subtask', 'write_scratchpad', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'EPISODIC',
    hint: 'The Coordinator Agent delegates sub-tasks in sequence: Security Agent (Key Vault -> ADLS Gen 2) -> Spark Engineer (Databricks) -> Warehouse Architect (ADF -> Synapse DB).',
    solutionExplanation:
      'The Coordinator delegates Subtask 1 to Security Agent to rotate SAS tokens in Key Vault and mount ADLS Gen 2. Next, it delegates Subtask 2 to Spark Engineer to execute Delta Lake optimization in Databricks. Finally, it delegates Subtask 3 to Warehouse Architect to trigger Azure Data Factory and load Synapse DB!',
  },
];
