/**
 * storage.js – localStorage wrappers for the Bug Tracking System
 */

const KEYS = {
  projects: 'bts_projects',
  people:   'bts_people',
  issues:   'bts_issues',
};

function getProjects() {
  return JSON.parse(localStorage.getItem(KEYS.projects) || '[]');
}
function saveProjects(data) {
  localStorage.setItem(KEYS.projects, JSON.stringify(data));
}

function getPeople() {
  return JSON.parse(localStorage.getItem(KEYS.people) || '[]');
}
function savePeople(data) {
  localStorage.setItem(KEYS.people, JSON.stringify(data));
}

function getIssues() {
  return JSON.parse(localStorage.getItem(KEYS.issues) || '[]');
}
function saveIssues(data) {
  localStorage.setItem(KEYS.issues, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
