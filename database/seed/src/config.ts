import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY');
}

// Create Supabase client with service role key (has full database access)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Data generation configuration
export const config = {
  // Target data volumes
  projects: {
    min: 150,
    max: 200
  },
  contacts: {
    min: 300,
    max: 400
  },
  documents: {
    min: 800,
    max: 1000,
    perProject: { min: 4, max: 8 }
  },
  calendar: {
    min: 500,
    max: 700,
    perProject: { min: 3, max: 6 }
  },
  notes: {
    min: 600,
    max: 800,
    perProject: { min: 3, max: 6 }
  },
  tasks: {
    min: 400,
    max: 600,
    perProject: { min: 2, max: 5 }
  },
  timeEntries: {
    min: 2000,
    max: 3000,
    perProject: { min: 10, max: 20 }
  },
  expenses: {
    min: 300,
    max: 500,
    perProject: { min: 2, max: 4 }
  },
  invoices: {
    min: 150,
    max: 250,
    perProject: { min: 1, max: 2 }
  },

  // Distribution percentages
  caseTypes: {
    'Personal Injury': 0.40,
    'Corporate': 0.25,
    'Family Law': 0.15,
    'Employment': 0.10,
    'Real Estate': 0.10
  },

  statuses: {
    'Open': 0.70,
    'Closed': 0.25,
    'On Hold': 0.05
  },

  priorities: {
    'High': 0.25,
    'Medium': 0.50,
    'Low': 0.25
  },

  contactTypes: {
    'Attorney': 0.20,
    'Client': 0.35,
    'Opposing Counsel': 0.15,
    'Witness': 0.20,
    'Expert': 0.10
  }
};

// Utility function to get random number in range
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility function to get random item from array
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Utility function to select based on distribution
export function selectByDistribution(distribution: Record<string, number>): string {
  const rand = Math.random();
  let cumulative = 0;

  for (const [key, probability] of Object.entries(distribution)) {
    cumulative += probability;
    if (rand < cumulative) {
      return key;
    }
  }

  // Fallback to first key if something goes wrong
  return Object.keys(distribution)[0];
}

// Utility function to generate date range
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
