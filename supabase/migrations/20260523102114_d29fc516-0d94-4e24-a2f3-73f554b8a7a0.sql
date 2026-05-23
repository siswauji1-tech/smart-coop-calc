
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  farm_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Flocks (kawanan)
CREATE TYPE flock_type AS ENUM ('indukan','pembesaran','doc','petelur');
CREATE TYPE flock_status AS ENUM ('aktif','selesai','dijual');

CREATE TABLE public.flocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type flock_type NOT NULL,
  initial_count INT NOT NULL DEFAULT 0,
  current_count INT NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status flock_status NOT NULL DEFAULT 'aktif',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_flocks_user ON public.flocks(user_id);

-- Expenses
CREATE TYPE expense_category AS ENUM ('pakan','obat','vitamin','alat','kandang','tenaga_kerja','modal_awal','listrik_air','transport','lain');

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flock_id UUID REFERENCES public.flocks(id) ON DELETE SET NULL,
  category expense_category NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(12,2),
  unit TEXT,
  unit_price NUMERIC(14,2),
  amount NUMERIC(14,2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_user ON public.expenses(user_id);
CREATE INDEX idx_expenses_flock ON public.expenses(flock_id);

-- Mortalities
CREATE TABLE public.mortalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES public.flocks(id) ON DELETE CASCADE,
  count INT NOT NULL,
  cause TEXT,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mort_user ON public.mortalities(user_id);

-- Productions (telur, DOC, dst)
CREATE TYPE production_type AS ENUM ('telur','doc','daging');

CREATE TABLE public.productions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flock_id UUID REFERENCES public.flocks(id) ON DELETE SET NULL,
  type production_type NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'butir',
  production_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prod_user ON public.productions(user_id);

-- Sales
CREATE TYPE sale_type AS ENUM ('telur','doc','indukan','ayam_afkir','daging','pupuk_kandang');

CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flock_id UUID REFERENCES public.flocks(id) ON DELETE SET NULL,
  type sale_type NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL,
  total NUMERIC(14,2) NOT NULL,
  buyer TEXT,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_user ON public.sales(user_id);

-- Assets (untuk depresiasi)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  purchase_value NUMERIC(14,2) NOT NULL,
  salvage_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  useful_life_months INT NOT NULL DEFAULT 60,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assets_user ON public.assets(user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mortalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Generic per-user policies macro-style
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['flocks','expenses','mortalities','productions','sales','assets']) LOOP
    EXECUTE format('CREATE POLICY "own %1$s select" ON public.%1$I FOR SELECT USING (auth.uid() = user_id)', t);
    EXECUTE format('CREATE POLICY "own %1$s insert" ON public.%1$I FOR INSERT WITH CHECK (auth.uid() = user_id)', t);
    EXECUTE format('CREATE POLICY "own %1$s update" ON public.%1$I FOR UPDATE USING (auth.uid() = user_id)', t);
    EXECUTE format('CREATE POLICY "own %1$s delete" ON public.%1$I FOR DELETE USING (auth.uid() = user_id)', t);
  END LOOP;
END $$;

-- Profile auto-create trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, farm_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.raw_user_meta_data->>'farm_name',''));
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
