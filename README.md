# Hospitality Operations Survey

A polished, mobile-first 2-minute research survey for hotel, restaurant and café operators.

## Stack

- Next.js
- TypeScript
- PostgreSQL
- Vercel-compatible deployment

## Run locally

```bash
npm install
npm run dev
```

## Database

Set `DATABASE_URL` in the deployment environment.

The first submission automatically creates the `survey_responses` table.

## Source tracking

Append a source to a survey link:

`https://your-domain.com/?source=client01`

The source is stored with each response so outreach can be measured.

## V1 principle

Keep the survey fast and useful. Do not add analytics complexity until real responses arrive.
