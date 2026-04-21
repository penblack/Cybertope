import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { validateEndpointUrl, callEndpoint } from '@/lib/runner/caller';
import { inngest } from '@/lib/runner/inngest-client';

const submitSchema = z.object({
  model_name: z.string().min(1, 'Model name is required'),
  endpoint_url: z.string().url('Must be a valid URL'),
  auth_type: z.enum(['none', 'bearer', 'api_key']),
  auth_value: z.string().optional(),
  input_field: z.string().min(1, 'Input field is required'),
  output_field: z.string().min(1, 'Output field is required'),
  turn_type: z.enum(['chat', 'completion']),
  capability_tier: z.enum(['base', 'instruction_tuned', 'full_application']),
  is_public: z.boolean().default(true),
  display_name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Validate endpoint URL
  const urlValidation = validateEndpointUrl(data.endpoint_url);
  if (!urlValidation.valid) {
    return NextResponse.json({ error: urlValidation.error }, { status: 400 });
  }

  // Rate limiting: check active assessments
  const { data: activeRuns } = await supabase
    .from('submissions')
    .select('id')
    .eq('user_id', session.user.id)
    .in('status', ['pending', 'running']);

  if (activeRuns && activeRuns.length >= 3) {
    return NextResponse.json({ error: 'You already have 3 active assessments. Please wait for them to complete.' }, { status: 429 });
  }

  // Rate limiting: check submissions in last 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select('id')
    .eq('user_id', session.user.id)
    .gte('created_at', oneDayAgo);

  if (recentSubmissions && recentSubmissions.length >= 10) {
    return NextResponse.json({ error: 'You have reached the limit of 10 submissions in the last 24 hours.' }, { status: 429 });
  }

  // Ping endpoint to validate it's reachable
  const testResponse = await callEndpoint(
    {
      endpoint_url: data.endpoint_url,
      auth_type: data.auth_type,
      auth_value: data.auth_value ?? null,
      input_field: data.input_field,
      output_field: data.output_field,
    },
    'Hello'
  );

  if (testResponse === null) {
    return NextResponse.json({ error: 'Could not reach the endpoint. Please check the URL and authentication details.' }, { status: 400 });
  }

  // Create submission
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .insert({
      user_id: session.user.id,
      model_name: data.model_name,
      endpoint_url: data.endpoint_url,
      auth_type: data.auth_type,
      auth_value: data.auth_value ?? null,
      input_field: data.input_field,
      output_field: data.output_field,
      turn_type: data.turn_type,
      capability_tier: data.capability_tier,
      is_public: data.is_public,
      display_name: data.display_name ?? null,
      status: 'pending',
    })
    .select()
    .single();

  if (submissionError || !submission) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }

  // Create assessment run
  const { data: assessmentRun, error: runError } = await supabase
    .from('assessment_runs')
    .insert({
      submission_id: submission.id,
      status: 'pending',
      progress_percent: 0,
    })
    .select()
    .single();

  if (runError || !assessmentRun) {
    return NextResponse.json({ error: 'Failed to create assessment run' }, { status: 500 });
  }

  // Fire Inngest event
  await inngest.send({
    name: 'assessment/start',
    data: {
      submissionId: submission.id,
      assessmentRunId: assessmentRun.id,
    },
  });

  return NextResponse.json({ assessmentRunId: assessmentRun.id });
}
