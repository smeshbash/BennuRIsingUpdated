-- Update is_admin function to include viewer and stakeholder. 
-- Volunteers and Interns return false for is_admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  return (auth.role() = 'authenticated' AND exists (
    select 1 from public.profiles
    where id = auth.uid()
    AND role IN ('super_admin', 'content_manager', 'content_creator', 'volunteer_manager', 'viewer', 'stakeholder')
  ));
end;
$$;

-- Secure Default Role Assignment to map Volunteer and Intern registrations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role text;
BEGIN
  -- First check whitelist
  SELECT role INTO assigned_role FROM public.admin_whitelist WHERE lower(email) = lower(new.email);
  
  -- If not in whitelist, check volunteer applications
  IF assigned_role IS NULL THEN
    SELECT application_type INTO assigned_role 
    FROM public.volunteer_applications 
    WHERE lower(email) = lower(new.email) AND status = 'approved' 
    LIMIT 1;
    
    -- Remap application_type to proper role names if necessary
    IF assigned_role = 'internship' THEN
      assigned_role := 'intern';
    ELSIF assigned_role = 'volunteer' THEN
      assigned_role := 'volunteer';
    ELSE
      assigned_role := 'user';
    END IF;
  END IF;

  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, assigned_role)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
