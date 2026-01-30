# HR Management (Next.js)

Ringkasan singkat:
- Aplikasi management lowongan pekerjaan oleh seorang HRD.
- Techstack: Next.js (app router), TypeScript, TailwindCSS.
- Mode pengembangan mendukung API mock (cepat untuk development tanpa backend).

Keterangan singkat struktur:
- `app/` — halaman Next.js (route-based).
- `components/` — komponen UI (dashboard, jobs, applicant, modals).
- `hooks/` — hooks reuseable (useAuth, useNotification, useConfirmation, ...).
- `lib/api/` — service API layer (JobService, ApplicantService, AuthService). Mendukung `USE_MOCK_API`.
- `utils/` — utilitas (mis. `canvasUtils.ts` untuk crop gambar).
- `types/` — definisi tipe TypeScript.
- `public/` — aset statis (icons, images).
- `package.json` — scripts dan dependency.

Persyaratan
- Node.js LTS (>=16 recommended)
- pnpm / npm / yarn (developer memakai npm)

Variabel lingkungan (contoh)
- NEXT_PUBLIC_API_URL — base URL API (default fallback disertakan).
- NEXT_PUBLIC_USE_MOCK — `'true' | 'false'` (string). Jika bukan `'false'` maka mock aktif.
- (Opsional) variabel lain jika backend memerlukan konfigurasi tambahan.

Quick start (lokal)
1. Install dependencies
   npm install
2. Mode development
   npm run dev
3. Build / preview
   npm run build
   npm run start
4. Lint / test (jika tersedia)
   npm run lint
   npm run test

Mode mock
- Untuk development cepat tanpa backend, set:
  NEXT_PUBLIC_USE_MOCK=true
- Mock logic berada di `lib/mock-db.ts` dan `lib/api/*` memeriksa `USE_MOCK_API`.

Konsep arsitektur singkat
- Service layer (`lib/api/*.ts`) menangani panggilan API dan mapping response ke tipe aplikasi. Gunakan service ini dari komponen, bukan fetch langsung.
- `hooks/useNotification` dan `hooks/useConfirmation` menyediakan API terpusat untuk menampilkan toast/konfirmasi.
- Komponen modal (EditJobModal, AddJobModal, CandidateDetailModal) menerima callback untuk aksi (submit, delete, update) — komponen tidak melakukan side-effect selain memanggil callback.

Git / workflow
- Gunakan branching feature: `feature/<short-desc>` atau `fix/<short-desc>`.
- Commit message singkat & jelas (conventional commit recommended): `feat(jobs): add job grid`.
- Selalu pull/rebase dari `main` sebelum push untuk mengurangi konflik:
  git fetch origin
  git pull --rebase origin <branch>
- Push ke remote branch dan buka Pull Request ke `main`. Gunakan `--force-with-lease` bila perlu setelah rebase.

Testing & quality
- Jalankan linter dan test sebelum push (perintah ada di package.json jika disediakan).
- Perbaiki warning/lint error agar pipeline CI tidak gagal.

Debugging & logs
- API wrapper `lib/api/client.ts` men-redirect ke `/login` saat mendapat 401.
- Untuk debugging, periksa console logs yang sudah disertakan pada service layer.

Cara kontribusi singkat
1. Fork / checkout repo
2. Buat branch baru dari `main`
3. Implementasi + test
4. Push branch dan buka PR dengan deskripsi perubahan & testing steps

Referensi file penting
- Auth: `lib/api/auth.service.ts`
- Jobs: `lib/api/job.service.ts`
- Applicants: `lib/api/applicant.service.ts`
- API client: `lib/api/client.ts`
- Crop util: `utils/canvasUtils.ts`
- Hooks notifikasi/konfirmasi: `hooks/useNotification.ts`, `hooks/useConfirmation.ts`

```
