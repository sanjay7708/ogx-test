# Portfolio (Next.js)

    npm install
    npm run dev

## Piano with MIDI.js
MIDI.js (archived, MIT) is not on npm. To enable it:
1. Download `build/MIDI.min.js` from https://github.com/mudcube/MIDI.js
2. Put it at `public/midi/MIDI.min.js`
3. Soundfonts load from https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/
   Self-host them and set NEXT_PUBLIC_SOUNDFONT_URL if you want no third-party dependency.
Without the file, the piano falls back to a Web Audio synth.

## Effects
`ShuffleText`, `RippleGrid`, `Waves` are original canvas/rAF implementations inspired by
React Bits. To use the official versions, copy them from reactbits.dev and swap the imports in app/page.tsx.

Edit all text in lib/content.ts.

## Contact form (MongoDB + email)
1. `cp .env.example .env.local` and fill in MONGODB_URI, SMTP_* and MAIL_FROM.
2. `npm install` then `npm run dev`.
3. Submissions are saved to the `contacts` collection (name, email, message, emailSent, createdAt).
4. On Vercel, add the same variables in Project Settings > Environment Variables.
5. In MongoDB Atlas, allow your host's IP (Vercel needs 0.0.0.0/0 or its integration).
