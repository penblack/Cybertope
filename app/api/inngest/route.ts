import { serve } from 'inngest/next';
import { inngest } from '@/lib/runner/inngest-client';
import { assessmentJob } from '@/lib/runner/jobs';

export const { GET, POST, PUT } = serve({ client: inngest, functions: [assessmentJob] });
