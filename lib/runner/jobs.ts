import { inngest } from './inngest-client';
import { createClient } from '@supabase/supabase-js';
import { PROMPT_INJECTION_TESTS } from '../tests/prompt-injection';
import { JAILBREAK_TESTS } from '../tests/jailbreak';
import { callEndpoint } from './caller';
import { evaluateTestResult } from '../scoring/rules';
import { calculateCategoryScore, calculateCompositeScore } from '../scoring/engine';
import { getOWASPStatus } from '../scoring/owasp';

const RUNS_PER_TEST = 5;
const DELAY_MS = 500;

type TestLike = {
  id: string;
  category: string;
  severity: string;
  description: string;
  prompt: string;
};

export const assessmentJob = inngest.createFunction(
  { id: 'run-assessment', triggers: [{ event: 'assessment/start' }] },
  async ({ event }) => {
    const { submissionId, assessmentRunId } = event.data as { submissionId: string; assessmentRunId: string };
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Get submission
    const { data: submission } = await supabase.from('submissions').select('*').eq('id', submissionId).single();
    if (!submission) throw new Error('Submission not found');

    // Mark running
    await supabase.from('assessment_runs').update({ status: 'running' }).eq('id', assessmentRunId);

    // Create category score rows
    await supabase.from('category_scores').insert([
      { assessment_run_id: assessmentRunId, category_slug: 'prompt_injection', status: 'pending', weight: 0.5, owasp_tag: 'LLM01' },
      { assessment_run_id: assessmentRunId, category_slug: 'jailbreak', status: 'pending', weight: 0.5, owasp_tag: 'LLM07' },
    ]);

    let consecutiveFailures = 0;

    async function runCategory(tests: TestLike[], slug: string) {
      await supabase.from('category_scores').update({ status: 'running' }).eq('assessment_run_id', assessmentRunId).eq('category_slug', slug);
      await supabase.from('assessment_runs').update({ current_category: slug }).eq('id', assessmentRunId);

      const allResults: Array<{ testId: string; passed: boolean; severity: string }> = [];

      for (const test of tests) {
        for (let run = 1; run <= RUNS_PER_TEST; run++) {
          await new Promise(r => setTimeout(r, DELAY_MS));

          const response = await callEndpoint(submission, test.prompt);

          if (!response) {
            consecutiveFailures++;
            if (consecutiveFailures >= 3) {
              await supabase.from('assessment_runs').update({ status: 'failed' }).eq('id', assessmentRunId);
              await supabase.from('submissions').update({ status: 'failed' }).eq('id', submissionId);
              throw new Error('Endpoint unreachable after 3 consecutive failures');
            }
            await supabase.from('test_results').insert({
              assessment_run_id: assessmentRunId,
              test_id: test.id,
              category_slug: slug,
              run_number: run,
              prompt_sent: test.prompt,
              response_received: '',
              passed: false,
              severity: test.severity,
              partial_success: false,
              raw_score: 0,
            });
            allResults.push({ testId: test.id, passed: false, severity: test.severity });
            continue;
          }

          consecutiveFailures = 0;
          const { passed, partial } = evaluateTestResult(test.id, response);

          await supabase.from('test_results').insert({
            assessment_run_id: assessmentRunId,
            test_id: test.id,
            category_slug: slug,
            run_number: run,
            prompt_sent: test.prompt,
            response_received: response,
            passed,
            severity: test.severity,
            partial_success: partial,
            raw_score: passed ? 1 : partial ? 0.5 : 0,
          });

          allResults.push({ testId: test.id, passed, severity: test.severity });
        }
      }

      const score = calculateCategoryScore(allResults);
      const owaspStatus = getOWASPStatus(score);
      await supabase.from('category_scores').update({ score, status: 'complete', owasp_status: owaspStatus }).eq('assessment_run_id', assessmentRunId).eq('category_slug', slug);
      return score;
    }

    const piScore = await runCategory(PROMPT_INJECTION_TESTS, 'prompt_injection');
    await supabase.from('assessment_runs').update({ progress_percent: 50 }).eq('id', assessmentRunId);

    const jbScore = await runCategory(JAILBREAK_TESTS, 'jailbreak');
    await supabase.from('assessment_runs').update({ progress_percent: 100 }).eq('id', assessmentRunId);

    const composite = calculateCompositeScore(piScore, jbScore);
    await supabase.from('assessment_runs').update({ status: 'complete', progress_percent: 100 }).eq('id', assessmentRunId);
    await supabase.from('submissions').update({ status: 'complete', composite_score: composite }).eq('id', submissionId);
  }
);
