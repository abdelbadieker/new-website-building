-- ============================================================
-- Migration: Row Level Security (RLS) Policies
-- Purpose : Secure all tables so that:
--           • Merchants can only read/write their own data.
--           • The admin service-role key bypasses RLS entirely
--             (no changes needed for service-role — it is immune
--             to RLS by design).
--           • Public tables (reviews) allow anonymous reads.
--           • activity_logs and creative_briefs are insert-only
--             for authenticated users and readable only by admins
--             (service role).
-- ============================================================

-- ============================================================
-- 0.  Enable RLS on every table
-- ============================================================
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_briefs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1.  profiles
--     Merchants read/update their own row.
--     No merchant can read another merchant's profile.
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Merchant updates own profile" ON public.profiles;
DROP POLICY IF EXISTS "New user inserts own profile" ON public.profiles;

CREATE POLICY "Merchant reads own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Merchant updates own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- The handle_new_user trigger runs as SECURITY DEFINER so it can
-- insert the profile without needing an explicit policy here, but
-- adding one keeps things explicit:
CREATE POLICY "New user inserts own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2.  products
--     Merchants manage only their own products.
--     Public (anon) can read approved/published products if you
--     later add a published column; for now, only the owner reads.
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own products"   ON public.products;
DROP POLICY IF EXISTS "Merchant inserts own products" ON public.products;
DROP POLICY IF EXISTS "Merchant updates own products" ON public.products;
DROP POLICY IF EXISTS "Merchant deletes own products" ON public.products;

CREATE POLICY "Merchant reads own products"
  ON public.products
  FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchant inserts own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchant updates own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchant deletes own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = merchant_id);

-- ============================================================
-- 3.  orders
--     Merchants read/update only their own orders.
--     Customers don't have a Supabase Auth account in the current
--     design, so all customer-side order creation goes through
--     admin API routes (service role).
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own orders"   ON public.orders;
DROP POLICY IF EXISTS "Merchant updates own orders" ON public.orders;

CREATE POLICY "Merchant reads own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchant updates own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ============================================================
-- 4.  customers
--     Merchants read only their own customers.
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own customers"   ON public.customers;
DROP POLICY IF EXISTS "Merchant inserts own customers" ON public.customers;
DROP POLICY IF EXISTS "Merchant updates own customers" ON public.customers;

CREATE POLICY "Merchant reads own customers"
  ON public.customers
  FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchant inserts own customers"
  ON public.customers
  FOR INSERT
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchant updates own customers"
  ON public.customers
  FOR UPDATE
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

-- ============================================================
-- 5.  support_tickets
--     Merchants read/create/update only their own tickets.
--     user_email is used as the correlation field since tickets
--     are submitted with the authenticated user's email.
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own tickets"   ON public.support_tickets;
DROP POLICY IF EXISTS "Merchant inserts own tickets" ON public.support_tickets;

CREATE POLICY "Merchant reads own tickets"
  ON public.support_tickets
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND user_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Merchant inserts own tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- ============================================================
-- 6.  creative_briefs
--     Merchants submit briefs and can read their own.
--     merchant_id column must reference auth.uid().
-- ============================================================
DROP POLICY IF EXISTS "Merchant reads own briefs"   ON public.creative_briefs;
DROP POLICY IF EXISTS "Merchant inserts own briefs" ON public.creative_briefs;

CREATE POLICY "Merchant reads own briefs"
  ON public.creative_briefs
  FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchant inserts own briefs"
  ON public.creative_briefs
  FOR INSERT
  WITH CHECK (auth.uid() = merchant_id);

-- ============================================================
-- 7.  activity_logs
--     Write-only for authenticated users (the platform logs events).
--     No merchant can read any activity log — that is admin-only.
--     The admin panel uses the service-role key which bypasses RLS.
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users insert activity logs" ON public.activity_logs;

CREATE POLICY "Authenticated users insert activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- No SELECT policy → only service-role (admin) can read logs.

-- ============================================================
-- 8.  reviews
--     Anyone can read approved reviews (for public site display).
--     Only authenticated users can submit a review.
--     Approval is done by admin (service role).
-- ============================================================
DROP POLICY IF EXISTS "Public reads approved reviews"      ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users submit reviews" ON public.reviews;

CREATE POLICY "Public reads approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users submit reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
