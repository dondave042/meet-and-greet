import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const creatorFromRow = (row: any) => ({
  id: row.id, name: row.name, tagline: row.tagline, bio: row.bio, image: row.image_url,
  rates: { hourly: row.hourly_rate, event: row.event_rate, VIPDinner: row.vip_dinner_rate },
  specialties: row.specialties, boundaries: row.boundaries, stats: row.stats,
  upcomingEvents: row.upcoming_events, gallery: row.gallery ?? [],
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const [creatorResult, bookingResult] = await Promise.all([
        pool.query(`SELECT c.*, COALESCE(json_agg(json_build_object('id', g.id, 'type', g.media_type, 'url', g.url, 'title', g.title, 'category', g.category, 'isAdult', g.is_adult)) FILTER (WHERE g.id IS NOT NULL), '[]') AS gallery FROM creators c LEFT JOIN gallery_media g ON g.creator_id = c.id GROUP BY c.id ORDER BY c.created_at DESC`),
        pool.query(`SELECT b.*, COALESCE(json_agg(json_build_object('id', m.id, 'sender', m.sender, 'text', m.message, 'timestamp', m.created_at) ORDER BY m.created_at) FILTER (WHERE m.id IS NOT NULL), '[]') AS messages FROM bookings b LEFT JOIN booking_messages m ON m.booking_id = b.id GROUP BY b.id ORDER BY b.created_at DESC`),
      ]);
      return res.status(200).json({ creators: creatorResult.rows.map(creatorFromRow), bookings: bookingResult.rows.map((row) => ({
        id: row.id, creatorId: row.creator_id, creatorName: row.creator_name, fanName: row.fan_name, fanAge: row.fan_age,
        fanCountry: row.fan_country, fanState: row.fan_state, fanCity: row.fan_city, fanEmail: row.fan_email, fanPhone: row.fan_phone,
        fanSocials: row.fan_socials, meetingType: row.meeting_type, reasonToMeet: row.reason_to_meet, date: row.meeting_date,
        time: row.meeting_time, duration: row.duration, budget: row.budget, idVerified: row.id_verified, idImageName: row.id_image_name ?? '',
        selfieImageName: row.selfie_image_name ?? '', backgroundCheckAgreed: row.background_check_agreed, termsAgreed: row.terms_agreed,
        status: row.status, createdAt: row.created_at, notes: row.notes ?? '', messages: row.messages,
      })) });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { action, creator, booking, message, galleryItem } = req.body ?? {};

    if (action === 'save_creator') {
      await pool.query(`INSERT INTO creators (id, name, tagline, bio, image_url, hourly_rate, event_rate, vip_dinner_rate, specialties, boundaries, stats, upcoming_events) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, tagline=EXCLUDED.tagline, bio=EXCLUDED.bio, image_url=EXCLUDED.image_url, hourly_rate=EXCLUDED.hourly_rate, event_rate=EXCLUDED.event_rate, vip_dinner_rate=EXCLUDED.vip_dinner_rate, specialties=EXCLUDED.specialties, boundaries=EXCLUDED.boundaries, stats=EXCLUDED.stats, upcoming_events=EXCLUDED.upcoming_events, updated_at=now()`, [creator.id, creator.name, creator.tagline, creator.bio, creator.image, creator.rates.hourly, creator.rates.event, creator.rates.VIPDinner, JSON.stringify(creator.specialties), JSON.stringify(creator.boundaries), JSON.stringify(creator.stats), JSON.stringify(creator.upcomingEvents)]);
      return res.status(200).json({ ok: true });
    }
    if (action === 'save_gallery') {
      await pool.query(`INSERT INTO gallery_media (id, creator_id, media_type, url, title, category, is_adult) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url, title=EXCLUDED.title, category=EXCLUDED.category, is_adult=EXCLUDED.is_adult`, [galleryItem.id, galleryItem.creatorId, galleryItem.type, galleryItem.url, galleryItem.title, galleryItem.category, galleryItem.isAdult]);
      return res.status(200).json({ ok: true });
    }
    if (action === 'save_profile') {
      await pool.query(`INSERT INTO fan_profiles (id, name, age, country, state, city, email, phone, social_links, profile_image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, age=EXCLUDED.age, country=EXCLUDED.country, state=EXCLUDED.state, city=EXCLUDED.city, phone=EXCLUDED.phone, profile_image_url=EXCLUDED.profile_image_url, updated_at=now()`, [profile.email.toLowerCase(), profile.name, profile.age, profile.country, profile.state, profile.city, profile.email, profile.phone ?? '', JSON.stringify(profile.socialLinks ?? {}), profile.profilePicture]);
      return res.status(200).json({ ok: true });
    }
    if (action === 'save_booking') {
      await pool.query(`INSERT INTO bookings (id, creator_id, creator_name, fan_name, fan_age, fan_country, fan_state, fan_city, fan_email, fan_phone, fan_socials, meeting_type, reason_to_meet, meeting_date, meeting_time, duration, budget, id_verified, id_image_name, selfie_image_name, background_check_agreed, terms_agreed, status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, notes=EXCLUDED.notes, updated_at=now()`, [booking.id, booking.creatorId, booking.creatorName, booking.fanName, booking.fanAge, booking.fanCountry, booking.fanState, booking.fanCity, booking.fanEmail, booking.fanPhone, JSON.stringify(booking.fanSocials), booking.meetingType, booking.reasonToMeet, booking.date, booking.time, booking.duration, booking.budget, booking.idVerified, booking.idImageName, booking.selfieImageName, booking.backgroundCheckAgreed, booking.termsAgreed, booking.status, booking.notes]);
      for (const item of booking.messages ?? []) await pool.query(`INSERT INTO booking_messages (id, booking_id, sender, message) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`, [item.id, booking.id, item.sender, item.text]);
      return res.status(200).json({ ok: true });
    }
    if (action === 'save_message') {
      await pool.query(`INSERT INTO booking_messages (id, booking_id, sender, message) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`, [message.id, message.bookingId, message.sender, message.text]);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    console.error('[v0] Database request failed:', error);
    return res.status(500).json({ error: 'Database request failed' });
  }
}
