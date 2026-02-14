import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rtfxirdqyxvdnvwajhyv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0ZnhpcmRxeXh2ZG52d2FqaHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODM1ODIsImV4cCI6MjA4NjQ1OTU4Mn0.71FlSnEf-7X9o_6M0XwYZ9uGAlFz0-i4ckVagbygnoY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

