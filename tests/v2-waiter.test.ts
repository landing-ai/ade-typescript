import { JobFailedError, JobWaitTimeoutError } from 'landingai-ade';
import { PollClock, pollUntilTerminal } from 'landingai-ade/resources/v2/_base';
import { Job, JobStatus } from 'landingai-ade/resources/v2/types';

function makeJob(status: JobStatus, error: Job['error'] = null): Job {
  return {
    job_id: 'j',
    status,
    created_at: null,
    completed_at: null,
    progress: null,
    result: null,
    error,
    is_terminal: status === 'completed' || status === 'failed' || status === 'cancelled',
    raw: {},
  };
}

// Fake clock: `sleep` advances virtual time instead of waiting, so tests run
// instantly and deterministically.
function fakeClock(): PollClock {
  let t = 0;
  return {
    now: () => t,
    sleep: async (ms: number) => {
      t += ms;
    },
  };
}

describe('pollUntilTerminal', () => {
  test('returns once the job is terminal', async () => {
    const statuses: JobStatus[] = ['pending', 'processing', 'completed'];
    let i = 0;
    const job = await pollUntilTerminal(async () => makeJob(statuses[i++]!), {}, fakeClock());
    expect(job.status).toBe('completed');
    expect(i).toBe(3);
  });

  test('throws JobWaitTimeoutError when it never finishes', async () => {
    await expect(
      pollUntilTerminal(async () => makeJob('processing'), { timeout: 5000 }, fakeClock()),
    ).rejects.toBeInstanceOf(JobWaitTimeoutError);
  });

  test('throws JobFailedError when raiseOnFailure and the job failed with an error', async () => {
    await expect(
      pollUntilTerminal(
        async () => makeJob('failed', { code: 'x', message: 'boom' }),
        { raiseOnFailure: true },
        fakeClock(),
      ),
    ).rejects.toBeInstanceOf(JobFailedError);
  });

  test('does not throw on failure when raiseOnFailure is false', async () => {
    const job = await pollUntilTerminal(
      async () => makeJob('failed', { code: 'x', message: 'boom' }),
      { raiseOnFailure: false },
      fakeClock(),
    );
    expect(job.status).toBe('failed');
  });

  test('raiseOnFailure throws on a failed job even with no error payload', async () => {
    await expect(
      pollUntilTerminal(async () => makeJob('failed', null), { raiseOnFailure: true }, fakeClock()),
    ).rejects.toBeInstanceOf(JobFailedError);
  });

  test('raiseOnFailure does NOT throw on a completed job carrying a residual error object', async () => {
    const job = await pollUntilTerminal(
      async () => makeJob('completed', { code: null, message: null }),
      { raiseOnFailure: true },
      fakeClock(),
    );
    expect(job.status).toBe('completed');
  });
});
