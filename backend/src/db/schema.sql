-- ExamEdge PostgreSQL schema (Phases 0–2)
-- gen_random_uuid() is registered in pool.js for pg-mem; use pgcrypto on real PostgreSQL if needed.

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT,
  lga TEXT,
  type TEXT CHECK (type IN ('public', 'private')),
  subscription_tier TEXT DEFAULT 'free',
  admin_user_id UUID,
  logo_url TEXT,
  school_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  school_name TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  subscription_tier TEXT DEFAULT 'free',
  google_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  ss_class TEXT,
  subjects JSONB DEFAULT '[]',
  exam_target TEXT DEFAULT 'WAEC',
  exam_date DATE,
  study_streak INT DEFAULT 0,
  last_active_date DATE,
  readiness_score INT DEFAULT 0,
  parent_link_code TEXT UNIQUE,
  xp INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teachers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  subjects JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS parents (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_user_id UUID REFERENCES parents(user_id) ON DELETE CASCADE,
  student_user_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_user_id, student_user_id)
);

CREATE TABLE IF NOT EXISTS otp_codes (
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student',
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  topic TEXT,
  subtopic TEXT,
  year INT,
  exam_body TEXT,
  type TEXT DEFAULT 'MCQ',
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation_text TEXT,
  explanation_video_url TEXT,
  difficulty TEXT DEFAULT 'medium',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_year ON questions(year);
CREATE INDEX IF NOT EXISTS idx_questions_exam_body ON questions(exam_body);

CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INT,
  attempt_number INT DEFAULT 1,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);

CREATE TABLE IF NOT EXISTS weakness_map (
  student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT DEFAULT '',
  accuracy_rate NUMERIC(5,2) DEFAULT 0,
  attempts_count INT DEFAULT 0,
  last_attempted TIMESTAMPTZ,
  status TEXT DEFAULT 'Unattempted',
  PRIMARY KEY (student_id, subject, topic, subtopic)
);

CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  plan_json JSONB NOT NULL,
  exam_date DATE,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_days JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(user_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  ss_level TEXT,
  subject TEXT,
  student_ids JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(user_id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  question_ids JSONB NOT NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  submitted_at TIMESTAMPTZ,
  PRIMARY KEY (assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  state TEXT,
  score INT DEFAULT 0,
  xp INT DEFAULT 0,
  week_number INT,
  year INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_student_week
  ON leaderboard_entries(student_id, week_number, year);

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS student_badges (
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, badge_id)
);

CREATE TABLE IF NOT EXISTS daily_limits (
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  question_count INT DEFAULT 0,
  mock_exams_count INT DEFAULT 0,
  PRIMARY KEY (student_id, date)
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  amount_kobo INT NOT NULL,
  status TEXT DEFAULT 'pending',
  plan TEXT,
  paystack_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  phone TEXT PRIMARY KEY,
  active_question_id TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  mood TEXT,
  session_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_custom_questions (
  id TEXT PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  question_data JSONB NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offline_downloads (
  student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, subject)
);
