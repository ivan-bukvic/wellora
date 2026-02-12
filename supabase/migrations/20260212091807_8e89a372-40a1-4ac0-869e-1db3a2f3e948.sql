
CREATE OR REPLACE FUNCTION public.seed_demo_data_for_user(new_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  aw uuid := '038a9c76-4848-48a9-8245-2d2fefe85711'; -- Walking
  asl uuid := 'e74434f7-3f12-4854-a66f-493f0fc1cb28'; -- Sleeping
  ast uuid := '1f244fe2-03a7-45b8-8da8-5ecd8868821f'; -- Stretching
  ah uuid := 'd3942123-3739-459f-ac0d-04f8de531dc7';  -- Hydration
  am uuid := 'e363142a-a13c-45bd-9728-a1143a2b5d5a';  -- Mindfulness
BEGIN
  -- Fixed frozen demo dataset: January 1–21, 2026
  -- Identical for every new user. No randomness, no relative dates.

  -- === Jan 1 (Thu) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-01', true, 30);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-01', true, 7.2);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-01', true, 15);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-01', true, 7);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-01', true, 10);

  -- === Jan 2 (Fri) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-02', true, 25);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-02', true, 6.8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-02', true, 12);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-02', false, 5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-02', true, 15);

  -- === Jan 3 (Sat) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-03', true, 40);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-03', true, 8.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-03', true, 8);
  -- No stretching or mindfulness (weekend gap)

  -- === Jan 4 (Sun) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-04', true, 8.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-04', true, 6);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-04', true, 20);
  -- Rest day: no walking or stretching

  -- === Jan 5 (Mon) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-05', true, 35);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-05', true, 7.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-05', true, 18);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-05', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-05', true, 12);

  -- === Jan 6 (Tue) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-06', true, 28);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-06', true, 7.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-06', true, 10);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-06', false, 4);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-06', true, 10);

  -- === Jan 7 (Wed) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-07', true, 32);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-07', true, 6.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-07', true, 14);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-07', true, 7);

  -- === Jan 8 (Thu) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-08', true, 30);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-08', true, 7.8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-08', true, 16);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-08', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-08', true, 15);

  -- === Jan 9 (Fri) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-09', true, 22);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-09', true, 7.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-09', true, 6);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-09', true, 8);

  -- === Jan 10 (Sat) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-10', true, 8.2);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-10', true, 7);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-10', true, 20);

  -- === Jan 11 (Sun) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-11', true, 8.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-11', false, 5);

  -- === Jan 12 (Mon) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-12', true, 35);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-12', true, 7.3);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-12', true, 20);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-12', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-12', true, 12);

  -- === Jan 13 (Tue) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-13', true, 28);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-13', true, 7.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-13', true, 15);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-13', true, 7);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-13', true, 10);

  -- === Jan 14 (Wed) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-14', true, 30);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-14', true, 7.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-14', false, 4);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-14', true, 18);

  -- === Jan 15 (Thu) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-15', true, 33);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-15', true, 7.8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-15', true, 12);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-15', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-15', true, 15);

  -- === Jan 16 (Fri) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-16', true, 25);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-16', true, 6.8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-16', true, 6);

  -- === Jan 17 (Sat) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-17', true, 45);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-17', true, 8.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-17', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-17', true, 20);

  -- === Jan 18 (Sun) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-18', true, 8.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-18', true, 7);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-18', true, 15);

  -- === Jan 19 (Mon) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-19', true, 30);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-19', true, 7.2);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-19', true, 18);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-19', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-19', true, 10);

  -- === Jan 20 (Tue) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-20', true, 28);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-20', true, 7.5);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-20', true, 14);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-20', true, 7);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-20', true, 12);

  -- === Jan 21 (Wed) ===
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, aw, '2026-01-21', true, 35);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours) VALUES (new_user_id, asl, '2026-01-21', true, 7.0);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, ast, '2026-01-21', true, 16);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units) VALUES (new_user_id, ah, '2026-01-21', true, 8);
  INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes) VALUES (new_user_id, am, '2026-01-21', true, 15);

  -- Seed initial AI insight
  INSERT INTO ai_insights (user_id, insight_type, insight_text, generated_for_date)
  VALUES (
    new_user_id,
    'weekly',
    'Welcome to Wellora! Based on your first three weeks, you''re building a solid foundation. Your sleep consistency is promising at 7+ hours most nights, and your walking habit is strong on weekdays. Keep focusing on maintaining hydration on weekends.',
    '2026-01-21'
  );
END;
$function$;
