// ⚠️ 把下面兩個值換成你在 Supabase Project Settings → Data API 看到的值
const SUPABASE_URL = 'https://oljckqbjybixvbwgbfgj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9samNrcWJqeWJpeHZid2diZmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1OTY3ODMsImV4cCI6MjEwMDE3Mjc4M30.DQYuMb4H0yUehsI7rY7yugtOD_FuzxcZieuVbYsaemI';

// 這個檔案會在所有頁面共用，之後每一頁都用 supabaseClient 這個變數來查資料
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
