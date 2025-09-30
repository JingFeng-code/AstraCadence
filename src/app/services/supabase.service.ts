// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uxsowsxotszjgpjdoqyt.supabase.co'; // 換成你的 Supabase 專案網址
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4c293c3hvdHN6amdwamRvcXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDk1NzEsImV4cCI6MjA2OTcyNTU3MX0.cVipRUEjmscyoxfkTOOlLbomSKtwFsNMHz58OtE-czg';       // 換成你的 public 匿名金鑰

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}