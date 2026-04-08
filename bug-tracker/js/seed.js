/**
 * seed.js – Seed 10+ test issues, people, and projects into localStorage.
 * Only runs once (guarded by a flag).
 */
const Seed = (() => {
  const SEEDED_FLAG = 'bts_seeded';

  function shouldSeed() {
    return !localStorage.getItem(SEEDED_FLAG);
  }

  function run() {
    if (!shouldSeed()) return;

    /* ── People ─────────────────────────────────────────────── */
    const people = [
      { name: 'Alice Johnson',  email: 'alice@example.com',  role: 'developer', avatar: 'AJ' },
      { name: 'Bob Smith',      email: 'bob@example.com',    role: 'designer',  avatar: 'BS' },
      { name: 'Carol Williams', email: 'carol@example.com',  role: 'tester',    avatar: 'CW' },
      { name: 'David Brown',    email: 'david@example.com',  role: 'manager',   avatar: 'DB' },
      { name: 'Eva Martinez',   email: 'eva@example.com',    role: 'developer', avatar: 'EM' },
    ];
    const savedPeople = people.map(p => Storage.create('people', p));

    /* ── Projects ────────────────────────────────────────────── */
    const projects = [
      { name: 'Frontend App',  description: 'React-based customer portal', color: '#4361ee' },
      { name: 'Backend API',   description: 'Node/Express REST API',        color: '#3f8efc' },
      { name: 'Mobile App',    description: 'iOS & Android application',    color: '#7b2d8b' },
      { name: 'DevOps',        description: 'CI/CD and infrastructure',     color: '#f72585' },
    ];
    const savedProjects = projects.map(p => Storage.create('projects', p));

    /* ── Issues ─────────────────────────────────────────────── */
    const issueTemplates = [
      {
        title: 'Login button unresponsive on Safari',
        description: 'Clicking the login button on Safari 16 does nothing. No console errors.',
        status: 'backlog', priority: 'high', type: 'bug',
        assigneeId: savedPeople[0].id, projectId: savedProjects[0].id,
        tags: ['frontend', 'auth', 'safari'],
      },
      {
        title: 'Implement dark mode toggle',
        description: 'Users have requested a dark mode for better readability at night.',
        status: 'ready', priority: 'medium', type: 'feature',
        assigneeId: savedPeople[1].id, projectId: savedProjects[0].id,
        tags: ['frontend', 'ux'],
      },
      {
        title: 'Dashboard loads slowly with 1000+ issues',
        description: 'When there are more than 1,000 issues the dashboard takes >5 seconds to render.',
        status: 'in-progress', priority: 'critical', type: 'bug',
        assigneeId: savedPeople[0].id, projectId: savedProjects[0].id,
        tags: ['performance', 'frontend'],
      },
      {
        title: 'Add pagination to issues table',
        description: 'The issues table currently loads all records. Add server-side pagination.',
        status: 'backlog', priority: 'medium', type: 'improvement',
        assigneeId: savedPeople[4].id, projectId: savedProjects[1].id,
        tags: ['backend', 'frontend'],
      },
      {
        title: 'API returns 500 on invalid project ID',
        description: 'Sending an invalid project ID to GET /api/issues returns a 500 instead of 404.',
        status: 'ready', priority: 'high', type: 'bug',
        assigneeId: savedPeople[4].id, projectId: savedProjects[1].id,
        tags: ['backend', 'api'],
      },
      {
        title: 'Write unit tests for auth module',
        description: 'The auth module has 0% test coverage. Write unit tests for all auth functions.',
        status: 'in-progress', priority: 'medium', type: 'task',
        assigneeId: savedPeople[2].id, projectId: savedProjects[1].id,
        tags: ['testing', 'auth'],
      },
      {
        title: 'Push notifications for issue updates',
        description: 'Send push notifications when an issue assigned to the user changes status.',
        status: 'backlog', priority: 'low', type: 'feature',
        assigneeId: savedPeople[3].id, projectId: savedProjects[2].id,
        tags: ['mobile', 'notifications'],
      },
      {
        title: 'Fix crash on Android 12 startup',
        description: 'App crashes immediately on launch on Android 12 devices. Stack trace attached.',
        status: 'in-progress', priority: 'critical', type: 'bug',
        assigneeId: savedPeople[0].id, projectId: savedProjects[2].id,
        tags: ['mobile', 'android', 'crash'],
      },
      {
        title: 'Migrate CI pipeline to GitHub Actions',
        description: 'Move from Jenkins to GitHub Actions for all build and deploy workflows.',
        status: 'done', priority: 'medium', type: 'task',
        assigneeId: savedPeople[3].id, projectId: savedProjects[3].id,
        tags: ['devops', 'ci'],
      },
      {
        title: 'Set up staging environment',
        description: 'Create a staging environment mirroring production for QA testing.',
        status: 'done', priority: 'high', type: 'task',
        assigneeId: savedPeople[4].id, projectId: savedProjects[3].id,
        tags: ['devops', 'infrastructure'],
      },
      {
        title: 'Update dependency: lodash 4.17.20 → 4.17.21',
        description: 'Lodash 4.17.20 has a known prototype pollution vulnerability.',
        status: 'done', priority: 'high', type: 'improvement',
        assigneeId: savedPeople[2].id, projectId: savedProjects[1].id,
        tags: ['security', 'dependencies'],
      },
      {
        title: 'Offline mode for mobile app',
        description: 'Allow users to view and create issues while offline; sync when reconnected.',
        status: 'backlog', priority: 'medium', type: 'feature',
        assigneeId: savedPeople[1].id, projectId: savedProjects[2].id,
        tags: ['mobile', 'offline'],
      },
    ];

    issueTemplates.forEach(tpl => Storage.create('issues', tpl));

    localStorage.setItem(SEEDED_FLAG, 'true');
    console.info('[Seed] Database seeded with demo data.');
  }

  function reset() {
    localStorage.removeItem(SEEDED_FLAG);
    Storage.clear('issues');
    Storage.clear('people');
    Storage.clear('projects');
  }

  return { run, reset, shouldSeed };
})();
