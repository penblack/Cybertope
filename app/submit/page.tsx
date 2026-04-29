'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const schema = z.object({
  model_name: z.string().min(1, 'Required'),
  endpoint_url: z.string().url('Must be a valid URL').refine(
    url => url.startsWith('https://'),
    'URL must use HTTPS'
  ),
  auth_type: z.enum(['none', 'bearer', 'api_key']),
  auth_value: z.string().optional(),
  input_field: z.string().min(1, 'Required'),
  output_field: z.string().min(1, 'Required'),
  turn_type: z.enum(['chat', 'completion']),
  capability_tier: z.enum(['base', 'instruction_tuned', 'full_application']),
  is_public: z.boolean(),
  display_name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

export default function SubmitPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    model_name: '',
    endpoint_url: '',
    auth_type: 'none',
    auth_value: '',
    input_field: '',
    output_field: '',
    turn_type: 'completion',
    capability_tier: 'instruction_tuned',
    is_public: true,
    display_name: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(i => {
        const key = i.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? 'Something went wrong');
        return;
      }
      router.push(`/assessment/${data.assessmentRunId}`);
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (err?: string) =>
    `w-full bg-neutral-800 border ${err ? 'border-red-600' : 'border-neutral-700'} rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;

  return (
    <div className="min-h-screen text-white">
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">Cybertope</Link>
          <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Submit Your Model</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Provide your model&apos;s API endpoint and we&apos;ll run the full adversarial test suite against it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              What should we call this model on the leaderboard?
            </label>
            <input
              type="text"
              value={form.model_name}
              onChange={e => set('model_name', e.target.value)}
              className={inputClass(errors.model_name)}
              placeholder="e.g. My GPT-4 Wrapper"
            />
            {errors.model_name && <p className="text-xs text-red-400 mt-1">{errors.model_name}</p>}
          </div>

          {/* Endpoint URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Endpoint URL</label>
            <input
              type="url"
              value={form.endpoint_url}
              onChange={e => set('endpoint_url', e.target.value)}
              className={inputClass(errors.endpoint_url)}
              placeholder="https://api.example.com/v1/chat"
            />
            {errors.endpoint_url && <p className="text-xs text-red-400 mt-1">{errors.endpoint_url}</p>}
          </div>

          {/* Auth Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Auth Type</label>
            <select
              value={form.auth_type}
              onChange={e => set('auth_type', e.target.value as FormData['auth_type'])}
              className={inputClass()}
            >
              <option value="none">None</option>
              <option value="bearer">Bearer Token</option>
              <option value="api_key">API Key</option>
            </select>
          </div>

          {/* Auth Value */}
          {form.auth_type !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Auth Value</label>
              <input
                type="password"
                value={form.auth_value}
                onChange={e => set('auth_value', e.target.value)}
                className={inputClass(errors.auth_value)}
                placeholder={form.auth_type === 'bearer' ? 'Bearer token' : 'API key'}
              />
              {errors.auth_value && <p className="text-xs text-red-400 mt-1">{errors.auth_value}</p>}
            </div>
          )}

          {/* Input / Output fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                What field name does your API expect the prompt in?
              </label>
              <input
                type="text"
                value={form.input_field}
                onChange={e => set('input_field', e.target.value)}
                className={inputClass(errors.input_field)}
                placeholder="e.g. prompt, input, message"
              />
              {errors.input_field && <p className="text-xs text-red-400 mt-1">{errors.input_field}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Where in the response JSON is the model&apos;s reply?
              </label>
              <input
                type="text"
                value={form.output_field}
                onChange={e => set('output_field', e.target.value)}
                className={inputClass(errors.output_field)}
                placeholder="e.g. output, choices[0].message.content"
              />
              {errors.output_field && <p className="text-xs text-red-400 mt-1">{errors.output_field}</p>}
            </div>
          </div>

          {/* Turn Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Turn Type</label>
            <select
              value={form.turn_type}
              onChange={e => set('turn_type', e.target.value as FormData['turn_type'])}
              className={inputClass()}
            >
              <option value="completion">Single Turn (Completion)</option>
              <option value="chat">Multi Turn (Chat)</option>
            </select>
          </div>

          {/* Capability Tier */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Capability Tier</label>
            <select
              value={form.capability_tier}
              onChange={e => set('capability_tier', e.target.value as FormData['capability_tier'])}
              className={inputClass()}
            >
              <option value="base">Base Model</option>
              <option value="instruction_tuned">Instruction Tuned</option>
              <option value="full_application">Full Application</option>
            </select>
          </div>

          {/* Public Leaderboard */}
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-neutral-300">Show this assessment on the public leaderboard</p>
            </div>
            <button
              type="button"
              onClick={() => set('is_public', !form.is_public)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_public ? 'bg-indigo-600' : 'bg-neutral-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_public ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Anonymous */}
          {form.is_public && (
            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-300">List as Anonymous instead of my model name</p>
              </div>
              <button
                type="button"
                onClick={() => set('display_name', form.display_name === 'anonymous' ? '' : 'anonymous')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.display_name === 'anonymous' ? 'bg-indigo-600' : 'bg-neutral-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.display_name === 'anonymous' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}

          {serverError && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Verifying endpoint…' : 'Start Assessment'}
          </button>
        </form>
      </main>
    </div>
  );
}
