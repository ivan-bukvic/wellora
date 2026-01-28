-- Function to seed demo activity logs for a new user
CREATE OR REPLACE FUNCTION public.seed_demo_data_for_user(new_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  activity_walking uuid := '038a9c76-4848-48a9-8245-2d2fefe85711';
  activity_sleeping uuid := 'e74434f7-3f12-4854-a66f-493f0fc1cb28';
  activity_stretching uuid := '1f244fe2-03a7-45b8-8da8-5ecd8868821f';
  activity_hydration uuid := 'd3942123-3739-459f-ac0d-04f8de531dc7';
  activity_mindfulness uuid := 'e363142a-a13c-45bd-9728-a1143a2b5d5a';
  i integer;
  log_date date;
  is_weekend boolean;
  rand_val float;
BEGIN
  -- Seed 21 days of activity logs
  FOR i IN 0..20 LOOP
    log_date := CURRENT_DATE - i;
    is_weekend := EXTRACT(DOW FROM log_date) IN (0, 6);
    
    -- Walking: higher completion on weekdays (80%), lower on weekends (60%)
    rand_val := random();
    IF (NOT is_weekend AND rand_val > 0.2) OR (is_weekend AND rand_val > 0.4) THEN
      INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes)
      VALUES (new_user_id, activity_walking, log_date, true, 20 + floor(random() * 25)::int);
    END IF;
    
    -- Sleeping: almost always tracked (90%)
    IF random() > 0.1 THEN
      INSERT INTO activity_logs (user_id, activity_type_id, date, completed, sleep_duration_hours)
      VALUES (new_user_id, activity_sleeping, log_date, true, 6.5 + (random() * 2)::numeric(3,1));
    END IF;
    
    -- Stretching: 60% completion rate
    IF random() > 0.4 THEN
      INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes)
      VALUES (new_user_id, activity_stretching, log_date, true, 10 + floor(random() * 15)::int);
    END IF;
    
    -- Hydration: 65% completion rate
    IF random() > 0.35 THEN
      INSERT INTO activity_logs (user_id, activity_type_id, date, completed, hydration_units)
      VALUES (new_user_id, activity_hydration, log_date, true, 6 + floor(random() * 3)::int);
    END IF;
    
    -- Mindfulness: improving over time (more recent = higher chance)
    rand_val := random();
    IF (i < 7 AND rand_val > 0.3) OR (i >= 7 AND rand_val > 0.5) THEN
      INSERT INTO activity_logs (user_id, activity_type_id, date, completed, duration_minutes)
      VALUES (new_user_id, activity_mindfulness, log_date, true, 8 + floor(random() * 12)::int);
    END IF;
  END LOOP;
  
  -- Seed initial AI insight
  INSERT INTO ai_insights (user_id, insight_type, insight_text, generated_for_date)
  VALUES (
    new_user_id,
    'weekly',
    'Welcome to Wellora! Based on your first week, you''re building a solid foundation. Your sleep consistency is promising, and your morning walks are becoming a healthy habit. Keep focusing on small, sustainable steps.',
    CURRENT_DATE
  );
END;
$function$;

-- Update the handle_new_user function to also seed demo data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'name', new.email);
  
  -- Seed demo data for the new user
  PERFORM public.seed_demo_data_for_user(new.id);
  
  RETURN new;
END;
$function$;