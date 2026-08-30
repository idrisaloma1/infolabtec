-- INFOLAB TECH BRIDGE — database schema
-- Target: Postgres (Supabase)

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bootcamps (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  date        DATE,
  location    TEXT,
  image       TEXT,
  published   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  date          DATE NOT NULL,
  category      TEXT NOT NULL,
  trainer       TEXT,
  technologies  TEXT[],           -- e.g. {Python,Scratch}
  cover_image   TEXT,             -- URL of cover photo shown on cards
  activity_link TEXT,             -- optional external link
  featured      BOOLEAN DEFAULT false,
  status        TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','review','published')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Media is polymorphic: belongs to an activity OR a gallery album.
CREATE TABLE IF NOT EXISTS media (
  id            SERIAL PRIMARY KEY,
  activity_id   INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  gallery_id    INTEGER, -- references gallery_albums(id), see below
  file_url      TEXT NOT NULL,
  thumbnail_url TEXT,
  media_type    TEXT NOT NULL CHECK (media_type IN ('photo','video')),
  caption       TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_albums (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT,
  published   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'media_gallery_fk'
  ) THEN
    ALTER TABLE media
      ADD CONSTRAINT media_gallery_fk
      FOREIGN KEY (gallery_id) REFERENCES gallery_albums(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  student_name TEXT NOT NULL,
  description  TEXT,
  technology   TEXT,
  category     TEXT NOT NULL,
  image        TEXT,
  project_url  TEXT,
  demo_url     TEXT,
  github_url   TEXT,
  video_url    TEXT,
  featured     BOOLEAN DEFAULT false,
  published    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id                 SERIAL PRIMARY KEY,
  title              TEXT NOT NULL,
  description        TEXT,
  date               DATE NOT NULL,
  time               TEXT,
  venue              TEXT,
  age_range          TEXT,
  registration_deadline DATE,
  registration_fee   TEXT,
  available_seats    INTEGER,
  registration_url   TEXT,
  banner             TEXT,
  published          BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id               SERIAL PRIMARY KEY,
  full_name        TEXT NOT NULL,
  address          TEXT,
  school           TEXT,
  age              INTEGER,
  email            TEXT NOT NULL,
  is_club_member   BOOLEAN NOT NULL DEFAULT false,
  parent_phone     TEXT,
  event_type       TEXT NOT NULL CHECK (event_type IN ('Bootcamp','Anniversary','Online Meeting')),
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (email, event_type)
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Editable homepage stats (Students Trained, Projects Built, etc.)
CREATE TABLE IF NOT EXISTS site_stats (
  key         TEXT PRIMARY KEY,   -- e.g. 'students_trained'
  label       TEXT NOT NULL,
  value       INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_stats (key, label, value) VALUES
  ('students_trained', 'Students Trained', 0),
  ('projects_built', 'Projects Built', 0),
  ('technologies_taught', 'Technologies Taught', 0),
  ('bootcamps_completed', 'Bootcamps Completed', 0)
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_featured ON activities(featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_media_activity ON media(activity_id);
CREATE INDEX IF NOT EXISTS idx_media_gallery ON media(gallery_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_type ON event_registrations(event_type);