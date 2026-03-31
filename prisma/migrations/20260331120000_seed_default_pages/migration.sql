-- Seed default pages (uses INSERT OR IGNORE to skip if already present)

INSERT OR IGNORE INTO "Page" ("id", "key", "title", "content", "heroTitle", "heroSubtitle", "heroImage", "updatedAt")
VALUES (
  'seed-page-home',
  'home',
  'Startseite',
  '',
  'Kunstobjekte &',
  'Fotografie',
  NULL,
  CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO "Page" ("id", "key", "title", "content", "heroTitle", "heroSubtitle", "heroImage", "updatedAt")
VALUES (
  'seed-page-about',
  'about',
  'Über mich',
  '',
  NULL,
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO "Page" ("id", "key", "title", "content", "heroTitle", "heroSubtitle", "heroImage", "updatedAt")
VALUES (
  'seed-page-impressum',
  'impressum',
  'Impressum',
  '',
  NULL,
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO "Page" ("id", "key", "title", "content", "heroTitle", "heroSubtitle", "heroImage", "updatedAt")
VALUES (
  'seed-page-datenschutz',
  'datenschutz',
  'Datenschutz',
  '',
  NULL,
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);
