Fachkonzept: Kunstgalerie-Website für Michael Hein

1. Projektübersicht
Projektname: Michael Hein – Kunstobjekte & Fotografie Typ: Portfolio-/Galerie-Website mit Admin-Backend Zielgruppe: Kunstinteressierte, potenzielle Käufer, Galeristen Sprache: Deutsch (UI), Code/Kommentare auf Englisch

2. Tech-Stack
Komponente	Technologie
Framework	Next.js 14+ (App Router)
Sprache	TypeScript
Styling	Tailwind CSS 3
Datenbank	SQLite via Prisma ORM
Auth (Admin)	NextAuth.js (Credentials Provider, nur Passwort, aus .env ziehen)
Bildverarbeitung	Sharp (Thumbnails, WebP-Konvertierung)
Bildupload	Lokaler Upload nach /public/uploads/, 5mb upload limit (nginx config)
Deployment	GitHub actions, Hostinger VPS
Paketmanager	pnpm
Begründung SQLite: Für eine Single-User-Galerie mit überschaubarem Datenvolumen ist SQLite performant, einfach zu sichern (eine Datei) und erfordert keinen separaten DB-Server.

3. Designrichtung
WICHTIG: Es existiert ein Design aus Google Stitch, das als visuelle Referenz dient. Das Design muss vor der Implementierung analysiert und die konkreten Farben, Fonts und Layout-Details daraus übernommen werden.
Allgemeine Richtung (falls Design nicht vorliegt)
* Layout: Großzügige Abstände, Bilder im Fokus, minimale UI-Elemente
* Animationen: Subtile Fade-Ins beim Scrollen, sanfte Hover-Effekte auf Thumbnails

4. Datenmodell (Prisma Schema)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // file:./dev.db
}

generator client {
  provider = "prisma-client-js"
}

model Album {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  // Markdown oder Plain Text
  coverImage  String?  // Pfad zum Coverbild (relativ)
  sortOrder   Int      @default(0)
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  artworks    Artwork[]
}

model Artwork {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  // Markdown oder Plain Text
  width       String?  // z.B. "30 cm" – als String für flexible Maßangaben
  height      String?  // z.B. "40 cm"
  depth       String?  // z.B. "5 cm" (für 3D-Objekte)
  dimensions  String?  // Alternativ: Freitext "30 × 40 × 5 cm"
  medium      String?  // Material/Technik, z.B. "Acryl auf Holz"
  createdDate String?  // Erstellungsdatum des Kunstwerks (Freitext: "2023", "März 2024")
  imagePath   String   // Pfad zum Originalbild
  thumbPath   String?  // Pfad zum generierten Thumbnail
  sortOrder   Int      @default(0)
  published   Boolean  @default(true)
  albumId     String
  album       Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}


5. Seitenstruktur & Routen
5.1 Öffentliche Seiten (Frontend)
/                           → Startseite (Hero + Featured Works)
/ueber-mich                 → Über mich & Kontakt (kombiniert)
/galerie                    → Album-Übersicht (paginiert)
/galerie/[albumSlug]        → Album-Detail: Artwork-Übersicht (paginiert)
/galerie/[albumSlug]/[artworkSlug]  → Artwork-Detail (Großansicht + Metadaten)
/impressum                  → Impressum
/datenschutz                → Datenschutz
5.2 Admin-Backend
/admin/login                → Login-Seite
/admin                      → Dashboard (Übersicht: Anzahl Alben, Artworks)
/admin/alben                → Album-Verwaltung (Liste, Sortierung per Drag & Drop)
/admin/alben/neu            → Neues Album anlegen
/admin/alben/[id]           → Album bearbeiten
/admin/alben/[id]/werke     → Werke in Album verwalten
/admin/alben/[id]/werke/neu → Neues Werk hochladen
/admin/alben/[id]/werke/[artworkId] → Werk bearbeiten


7. Admin-Backend – Detailspezifikation
7.1 Authentifizierung
* Login-Seite: Nur Passwort
* Session: NextAuth.js mit JWT-Strategy (kein separater Session-Store nötig)
* Schutz: Alle /admin/*-Routen via Middleware geschützt
7.2 Dashboard (/admin)
* Übersichtskarten: Anzahl Alben, Anzahl Werke, Anzahl veröffentlichter vs. Entwürfe
* Quick-Actions: "Neues Album", "Neues Werk hochladen"
7.3 Album-Verwaltung (/admin/alben)
Funktionen:
* Liste aller Alben (Titel, Cover-Thumbnail, Anzahl Werke, Status published/draft)
* Sortierung per Drag & Drop (speichert sortOrder)
* Aktionen: Bearbeiten, Löschen (mit Bestätigungsdialog), Veröffentlichen/Entwurf
* Button: "Neues Album erstellen"
Album-Formular (/admin/alben/neu bzw. /admin/alben/[id]):
* Felder: Titel, Slug (auto-generiert aus Titel, editierbar), Beschreibung (Textarea), Coverbild (Upload oder aus Album-Werken wählen), Status (Veröffentlicht/Entwurf)
* Slug-Validierung: Nur Kleinbuchstaben, Zahlen, Bindestriche
7.4 Werk-Verwaltung (/admin/alben/[id]/werke)
Funktionen:
* Grid-Ansicht aller Werke im Album (Thumbnails)
* Sortierung per Drag & Drop
* Multi-Upload: Mehrere Bilder gleichzeitig hochladen (Titel wird aus Dateiname generiert)
* Aktionen pro Werk: Bearbeiten, Löschen, Verschieben in anderes Album
Werk-Formular (/admin/alben/[id]/werke/neu bzw. .../[artworkId]):
* Bild-Upload: Drag & Drop Zone + Datei-Auswahl. Vorschau nach Upload.
* Felder: Titel, Slug, Maße (Breite, Höhe, Tiefe – optional, oder Freitext "Dimensions"), Material/Technik, Erstellungsdatum (Freitext), Beschreibung (Textarea)
* Beim Upload: Automatische Thumbnail-Generierung via Sharp (400px Breite, WebP)
7.5 Seiten-Verwaltung (/admin/seiten)
* Tabs oder Accordion: "Über mich", "Kontakt", "Impressum", "Datenschutz", "Startseite"
* Jeder Bereich: Textarea (Markdown) mit Live-Vorschau
* Hero-Bereich: Titel, Untertitel, Bild-Upload
* Speichern-Button pro Sektion

8. API-Routen
8.1 Öffentliche API (für Frontend-Paginierung, optional)
GET /api/albums?page=1&limit=12         → Paginierte Alben
GET /api/albums/[slug]                  → Einzelnes Album mit Metadaten
GET /api/albums/[slug]/artworks?page=1&limit=16  → Artworks eines Albums
GET /api/artworks/[slug]                → Einzelnes Artwork
Hinweis: Da Next.js Server Components verwendet werden, können viele Abfragen direkt im Server Component erfolgen. API-Routen sind primär für eventuelle Client-seitige Navigation oder AJAX-Paginierung.
8.2 Admin API (geschützt)
POST   /api/admin/albums            → Album erstellen
PUT    /api/admin/albums/[id]       → Album aktualisieren
DELETE /api/admin/albums/[id]       → Album löschen
PUT    /api/admin/albums/sort       → Sortierung aktualisieren (Array von IDs)

POST   /api/admin/artworks          → Artwork erstellen (multipart/form-data)
PUT    /api/admin/artworks/[id]     → Artwork aktualisieren
DELETE /api/admin/artworks/[id]     → Artwork löschen
PUT    /api/admin/artworks/sort     → Sortierung aktualisieren
PUT    /api/admin/artworks/[id]/move → In anderes Album verschieben

POST   /api/admin/upload            → Bild-Upload (multipart/form-data)

9. Bildverarbeitung
9.1 Upload-Workflow
1. Bild wird über Admin hochgeladen (multipart/form-data)
2. Original wird gespeichert: /public/uploads/original/[timestamp]-[filename]
3. Sharp generiert automatisch:
    * Thumbnail: 400px Breite, WebP, Qualität 80 → /public/uploads/thumb/[name].webp
    * Display-Version: 1200px Breite, WebP, Qualität 85 → /public/uploads/display/[name].webp
    * Original bleibt für Lightbox/Download erhalten
9.2 Verzeichnisstruktur Uploads
/public/uploads/
├── original/     # Originaldateien
├── display/      # Optimierte Anzeigeversion (1200px)
└── thumb/        # Thumbnails (400px)
9.3 Responsive Images
Im Frontend <Image>-Komponente von Next.js nutzen mit:
* sizes-Attribut für responsive Breakpoints
* priority für Above-the-fold-Bilder
* placeholder="blur" mit generiertem BlurHash (optional, nice-to-have)

10. SEO & Performance
* Metadata: Dynamische <title> und <meta description> pro Seite (aus Album-/Artwork-Daten)
* Open Graph: OG-Tags mit Artwork-Bildern für Social-Media-Sharing
* Structured Data: JSON-LD für ImageGallery und ImageObject (Schema.org)
* Sitemap: Automatisch generierte /sitemap.xml
* robots.txt: Admin-Bereich ausschließen
* Performance:
    * Next.js Image Optimization
    * Lazy Loading für Bilder unterhalb des Folds
    * Static Generation (SSG) für öffentliche Seiten wo möglich

11. DSGVO-Konformität
* Kein Kontaktformular (keine Datenverarbeitung nötig)
* Keine Cookies außer Session-Cookie im Admin (technisch notwendig)
* Keine externen Tracker (kein Google Analytics, keine Social-Media-Embeds)
* Keine externen Fonts – Fonts self-hosted in /public/fonts/
* Impressum + Datenschutzerklärung vorhanden und editierbar
* Bilder: Keine Personen-Fotos, daher kein Einwilligungsthema
* Optional: Minimaler Cookie-Banner nur für Admin-Session

13. Umgebungsvariablen (.env.local)
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="<zufällig-generierter-string>"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD="<admin-passwort>"

14. Implementierungsreihenfolge
Phase 1: Fundament
1. Next.js-Projekt initialisieren (pnpm, TypeScript, Tailwind, App Router)
2. Prisma Setup + Schema + Migration + Seed
3. NextAuth einrichten (Credentials Provider)
4. Basis-Layout (Header, Footer, Navigation) mit responsive Design
5. Self-hosted Fonts einbinden
Phase 2: Admin-Backend
1. Admin-Layout + Login-Seite
2. Album-CRUD (Erstellen, Bearbeiten, Löschen, Liste)
3. Bild-Upload mit Sharp-Verarbeitung
4. Artwork-CRUD (mit Bild-Upload)
5. Drag & Drop Sortierung (Alben + Werke)
6. Seiten-Verwaltung (Über mich, Kontakt, Impressum, Datenschutz, Hero)
Phase 3: Öffentliches Frontend
1. Startseite (Hero + Featured Works)
2. Album-Übersicht mit Paginierung
3. Album-Detail mit Artwork-Grid + Paginierung
4. Artwork-Detailansicht mit Thumbnail-Navigation + Vor/Zurück
5. Über mich & Kontakt Seite
6. Impressum & Datenschutz Seite
Phase 4: Polish & SEO
1. Animationen (Fade-In, Hover-Effekte, Transitions)
2. SEO-Metadaten + Open Graph
3. Responsive Feinschliff (alle Breakpoints testen)
4. Lightbox für Vollbild-Ansicht
5. Tastaturnavigation (Pfeiltasten) für Artwork-Detail
6. Sitemap + robots.txt
7. Performance-Optimierung (Lazy Loading, Image Optimization)
8. Deployment-Konfiguration

16. Hinweise für Claude Code
Wichtige Konventionen
* Server Components als Default nutzen (Next.js App Router). Client Components nur bei Interaktivität ("use client").
* Server Actions für Formulare im Admin-Backend nutzen (kein separater API-Call nötig für einfache CRUD-Operationen).
* Error Handling: Fehlerseiten (error.tsx) und Loading-States (loading.tsx) in jeder Route.
* Bildpfade: Immer relative Pfade ab /uploads/... in der Datenbank speichern, nie absolute Systempfade.
* Slug-Generierung: Deutsche Umlaute korrekt behandeln (ä→ae, ö→oe, ü→ue, ß→ss).
* Paginierung: Cursor-basiert oder Offset-basiert (Offset reicht bei überschaubarem Datenvolumen).
Design-Referenz
Vor der Implementierung des Frontends das Google Stitch Design analysieren und folgende Werte extrahieren: Farbpalette (HEX-Werte), Schriftarten, Abstände/Spacing, Layout-Grid, Button-Styles, Card-Styles. Diese als CSS-Variablen in globals.css definieren.
Qualitätskriterien
* Lighthouse Score > 90 (Performance, Accessibility, SEO)
* Vollständig responsive (Mobile-First)
* Alle Bilder in WebP mit Fallback
* Keine Layout-Shifts (CLS < 0.1)
* Admin-Backend funktional und intuitiv bedienbar
