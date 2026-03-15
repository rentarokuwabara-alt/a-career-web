/**
 * gas-client.ts
 * Google Apps Script API client
 */

import { ApiResponse, PaginatedResponse, Person, Project, Client, Worklog, MonthlySummary, BillingItem, PaymentCheck } from './types';

// Use local API proxy instead of calling GAS directly (avoids CORS issues)
const API_URL = '/api/gas';

/**
 * Base fetch wrapper
 */
async function callGAS<T = any>(action: string, payload?: any): Promise<T> {
  try {
    const body = {
      action,
      ...payload,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.error || data.message || 'API Error');
    }

    return data as T;
  } catch (error) {
    console.error(`[GAS API Error] ${action}:`, error);
    throw error;
  }
}

// ========================================
// Master CRUD
// ========================================

export async function readPeople() {
  return callGAS('readPeople') as Promise<PaginatedResponse<Person>>;
}

export async function createPerson(payload: any) {
  return callGAS('createPerson', payload) as Promise<ApiResponse>;
}

export async function updatePerson(id: string, payload: any) {
  return callGAS('updatePerson', { id, ...payload }) as Promise<ApiResponse>;
}

export async function deletePerson(id: string) {
  return callGAS('deletePerson', { id }) as Promise<ApiResponse>;
}

export async function readProjects() {
  return callGAS('readProjects') as Promise<PaginatedResponse<Project>>;
}

export async function createProject(payload: any) {
  return callGAS('createProject', payload) as Promise<ApiResponse>;
}

export async function updateProject(id: string, payload: any) {
  return callGAS('updateProject', { id, ...payload }) as Promise<ApiResponse>;
}

export async function deleteProject(id: string) {
  return callGAS('deleteProject', { id }) as Promise<ApiResponse>;
}

export async function readClients() {
  return callGAS('readClients') as Promise<PaginatedResponse<Client>>;
}

export async function createClient(payload: any) {
  return callGAS('createClient', payload) as Promise<ApiResponse>;
}

export async function updateClient(id: string, payload: any) {
  return callGAS('updateClient', { id, ...payload }) as Promise<ApiResponse>;
}

export async function deleteClient(id: string) {
  return callGAS('deleteClient', { id }) as Promise<ApiResponse>;
}

// ========================================
// Worklog CRUD
// ========================================

export async function readWorklog(month: string) {
  return callGAS('readWorklog', { month }) as Promise<PaginatedResponse<Worklog>>;
}

export async function createWorklog(payload: any) {
  return callGAS('createWorklog', payload) as Promise<ApiResponse>;
}

export async function updateWorklog(id: string, payload: any) {
  return callGAS('updateWorklog', { id, ...payload }) as Promise<ApiResponse>;
}

export async function deleteWorklog(id: string) {
  return callGAS('deleteWorklog', { id }) as Promise<ApiResponse>;
}

export async function bulkCreateWorklog(data: any[]) {
  return callGAS('bulkCreateWorklog', { data }) as Promise<ApiResponse>;
}

// ========================================
// Aggregates
// ========================================

export async function aggregateMonthly(month: string) {
  return callGAS('aggregateMonthly', { month }) as Promise<PaginatedResponse<MonthlySummary>>;
}

export async function generateBillingList(month: string) {
  return callGAS('generateBillingList', { month }) as Promise<PaginatedResponse<BillingItem>>;
}

export async function generatePaymentCheck(month: string) {
  return callGAS('generatePaymentCheck', { month }) as Promise<PaginatedResponse<PaymentCheck>>;
}

export async function getDashboardKPI(month: string) {
  return callGAS('getDashboardKPI', { month }) as Promise<ApiResponse>;
}

// ========================================
// Utility
// ========================================

export function isAPIAvailable(): boolean {
  return true; // API proxy is always available
}
