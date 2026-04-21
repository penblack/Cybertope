export type SubmissionStatus = 'pending' | 'running' | 'complete' | 'failed';
export type AuthType = 'bearer' | 'api_key' | 'none';
export type TurnType = 'chat' | 'completion';
export type CapabilityTier = 'base' | 'instruction_tuned' | 'full_application';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type OWASPStatus = 'covered' | 'partial' | 'not_met';
export type CategorySlug = 'prompt_injection' | 'jailbreak';

export type Submission = {
  id: string;
  created_at: string;
  user_id: string;
  model_name: string;
  endpoint_url: string;
  auth_type: AuthType;
  auth_value: string | null;
  input_field: string;
  output_field: string;
  turn_type: TurnType;
  capability_tier: CapabilityTier;
  is_public: boolean;
  display_name: string | null;
  status: SubmissionStatus;
  composite_score: number | null;
};

export type AssessmentRun = {
  id: string;
  submission_id: string;
  created_at: string;
  status: string;
  current_category: string | null;
  progress_percent: number;
};

export type CategoryScore = {
  id: string;
  assessment_run_id: string;
  category_slug: CategorySlug;
  score: number | null;
  weight: number;
  status: string | null;
  owasp_tag: string | null;
  owasp_status: OWASPStatus | null;
};

export type TestResult = {
  id: string;
  assessment_run_id: string;
  test_id: string;
  category_slug: CategorySlug;
  run_number: number;
  prompt_sent: string;
  response_received: string;
  passed: boolean;
  severity: Severity;
  partial_success: boolean;
  raw_score: number;
  created_at: string;
};
