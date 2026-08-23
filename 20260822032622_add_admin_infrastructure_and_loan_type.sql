/*
# Add admin infrastructure and loan_type column

## Overview
This migration adds admin login support, a loan_type column for data analysis,
and RLS policies allowing admins to view all loan applications and customers.

## Modified Tables
- `loan_applications`: Added `loan_type` text column (nullable) for easier
  SQL/Python/Power BI analysis. Backfilled from loan_purpose for existing rows.
  Added indexes on approval_status, application_date, and loan_type.

## New Tables
- `admins`: Stores admin user references.
  - `admin_id` (uuid, PK, default gen_random_uuid())
  - `user_id` (uuid, FK to auth.users, unique, ON DELETE CASCADE)
  - `email` (text, not null)
  - `created_at` (timestamptz, default now())

## Security
- `is_admin()` SECURITY DEFINER function: returns true if the current
  authenticated user exists in the admins table. Runs as the table owner
  to bypass RLS on the admins table.
- Admin SELECT policy on `loan_applications`: admins can SELECT all rows.
- Admin SELECT policy on `customers`: admins can SELECT all rows (for counting).
- `admins` table RLS: authenticated users can only SELECT their own row.

## Important Notes
1. The is_admin() function is SECURITY DEFINER with search_path = public.
2. Admin user (admin@loanease.com) is created separately after this migration.
3. loan_type stores the derived loan type (e.g., "Personal Loan", "Home Loan")
   for easier analysis in SQL, Python/Pandas, and Power BI.
4. All existing loan application data is preserved. The new loan_type column
   is nullable so existing rows are not affected.
*/

-- 1. Add loan_type column to loan_applications
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS loan_type text;

-- 2. Backfill loan_type from loan_purpose for existing rows
UPDATE loan_applications
SET loan_type = CASE
  WHEN loan_purpose IN ('Personal', 'Debt Consolidation', 'Medical') THEN 'Personal Loan'
  WHEN loan_purpose IN ('Home Purchase', 'Home Construction') THEN 'Home Loan'
  WHEN loan_purpose = 'Vehicle Loan' THEN 'Car Loan'
  WHEN loan_purpose = 'Education' THEN 'Education Loan'
  WHEN loan_purpose = 'Business Expansion' THEN 'Business Loan'
  ELSE loan_purpose
END
WHERE loan_type IS NULL;

-- 3. Create admins table
CREATE TABLE IF NOT EXISTS admins (
  admin_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_select_own" ON admins;
CREATE POLICY "admins_select_own"
ON admins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Create is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.user_id = auth.uid()
  );
$$;

-- 5. Add admin SELECT policies on loan_applications
DROP POLICY IF EXISTS "admin_select_loan_apps" ON loan_applications;
CREATE POLICY "admin_select_loan_apps"
ON loan_applications FOR SELECT
TO authenticated
USING (is_admin());

-- 6. Add admin SELECT policy on customers
DROP POLICY IF EXISTS "admin_select_customers" ON customers;
CREATE POLICY "admin_select_customers"
ON customers FOR SELECT
TO authenticated
USING (is_admin());

-- 7. Add indexes for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_loan_apps_approval_status ON loan_applications(approval_status);
CREATE INDEX IF NOT EXISTS idx_loan_apps_application_date ON loan_applications(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_loan_apps_loan_type ON loan_applications(loan_type);
