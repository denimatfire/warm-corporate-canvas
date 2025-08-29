# 🔐 **Supabase Admin Access Configuration Guide**

This guide will walk you through setting up proper admin access control in Supabase for your Warm Corporate Canvas project, replacing the current hardcoded role system with a robust database-driven approach.

## 🎯 **What You'll Get**

- **Secure Role Management**: Database-driven user roles instead of hardcoded metadata
- **Admin Controls**: Full administrative capabilities for managing users and content
- **Row Level Security**: Proper RLS policies based on user roles
- **Scalable Architecture**: Easy to add new roles and permissions
- **Audit Trail**: Track who granted roles and when

## 📋 **Prerequisites**

- Supabase project already set up (see `SUPABASE_SETUP.md`)
- Basic understanding of SQL and database concepts
- Access to your Supabase dashboard

## 🚀 **Step 1: Create User Roles Table**

### 1.1 Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 1.2 Create the User Roles Table

Copy and paste this SQL:

```sql
-- Create user_roles table for proper role management
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'writer', 'viewer')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_roles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. Click **Run** to execute the SQL

## 🔑 **Step 2: Update Articles Table RLS Policies**

### 2.1 Remove Old Policies

First, remove the existing policies that rely on hardcoded roles:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON articles;
DROP POLICY IF EXISTS "Users can update own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
DROP POLICY IF EXISTS "Authors can read own articles" ON articles;
```

### 2.2 Create New Role-Based Policies

```sql
-- Create new policies using the role system
CREATE POLICY "Public read access for published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create articles" ON articles
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    (get_user_role(auth.uid()) IN ('admin', 'writer'))
  );

CREATE POLICY "Users can update own articles or admin can update all" ON articles
  FOR UPDATE USING (
    auth.uid()::text = author OR 
    get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete own articles or admin can delete all" ON articles
  FOR DELETE USING (
    auth.uid()::text = author OR 
    get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Authors can read own articles or admin can read all" ON articles
  FOR SELECT USING (
    auth.uid()::text = author OR 
    get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Admin can publish/unpublish articles" ON articles
  FOR UPDATE USING (
    get_user_role(auth.uid()) = 'admin'
  ) WITH CHECK (
    get_user_role(auth.uid()) = 'admin'
  );
```

## 👤 **Step 3: Create Your First Admin User**

### 3.1 Find Your User ID

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Find your user account in the list
3. Copy the **ID** (UUID) of your user

### 3.2 Grant Admin Role

Replace `'your-user-id-here'` with your actual user ID:

```sql
-- Insert your first admin user
INSERT INTO user_roles (user_id, role, granted_by) 
VALUES (
  'your-user-id-here', 
  'admin', 
  'your-user-id-here'
);
```

**Example:**
```sql
INSERT INTO user_roles (user_id, role, granted_by) 
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
  'admin', 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);
```

## 🔄 **Step 4: Update Storage Policies (Optional)**

If you're using Supabase Storage for images, update those policies too:

```sql
-- Update storage policies to use role system
DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own article images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own article images" ON storage.objects;

CREATE POLICY "Authenticated users can upload article images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'article-images' AND 
    auth.role() = 'authenticated' AND
    get_user_role(auth.uid()) IN ('admin', 'writer')
  );

CREATE POLICY "Users can update own article images or admin can update all" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'article-images' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     get_user_role(auth.uid()) = 'admin')
  );

CREATE POLICY "Users can delete own article images or admin can delete all" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'article-images' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR 
     get_user_role(auth.uid()) = 'admin')
  );
```

## 🧪 **Step 5: Test the Setup**

### 5.1 Test Admin Access

1. Log out of your application
2. Log back in with your admin account
3. Navigate to `/admin/articles`
4. You should now have full admin access

### 5.2 Test Role Functions

In the SQL Editor, test the role functions:

```sql
-- Test getting your role (should return 'admin')
SELECT get_user_role('your-user-id-here');

-- Test admin check (should return true)
SELECT is_admin('your-user-id-here');
```

### 5.3 Test Article Management

1. Try creating a new article
2. Try publishing/unpublishing articles
3. Try deleting articles
4. All operations should work for admin users

## 👥 **Step 6: Manage Other Users**

### 6.1 Grant Writer Role

To give someone writer access:

```sql
INSERT INTO user_roles (user_id, role, granted_by) 
VALUES (
  'their-user-id', 
  'writer', 
  'your-admin-user-id'
);
```

### 6.2 Grant Viewer Role

To give someone read-only access:

```sql
INSERT INTO user_roles (user_id, role, granted_by) 
VALUES (
  'their-user-id', 
  'viewer', 
  'your-admin-user-id'
);
```

### 6.3 Update User Role

To change someone's role:

```sql
UPDATE user_roles 
SET role = 'writer', granted_by = 'your-admin-user-id', granted_at = NOW()
WHERE user_id = 'their-user-id';
```

### 6.4 Revoke User Role

To remove someone's access:

```sql
DELETE FROM user_roles WHERE user_id = 'their-user-id';
```

## 🛡️ **Step 7: Security Best Practices**

### 7.1 Regular Role Audits

```sql
-- View all users and their roles
SELECT 
  ur.user_id,
  ur.role,
  ur.granted_at,
  u.email,
  granted_by.email as granted_by_email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN auth.users granted_by ON ur.granted_by = granted_by.id
ORDER BY ur.granted_at DESC;
```

### 7.2 Monitor Admin Actions

```sql
-- View recent role changes
SELECT 
  ur.user_id,
  ur.role,
  ur.granted_at,
  u.email,
  granted_by.email as granted_by_email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN auth.users granted_by ON ur.granted_by = granted_by.id
WHERE ur.granted_at > NOW() - INTERVAL '30 days'
ORDER BY ur.granted_at DESC;
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Function get_user_role does not exist"**
   - Make sure you ran the SQL to create the functions
   - Check that the function names match exactly

2. **"Policy violation" errors**
   - Verify RLS policies are correctly created
   - Check that user roles are properly assigned
   - Ensure the `user_roles` table has data

3. **Users can't access features**
   - Check if they have a role assigned in `user_roles`
   - Verify the role is one of: 'admin', 'writer', 'viewer'
   - Check RLS policies are working

4. **Admin functions not working**
   - Verify your user has 'admin' role in `user_roles`
   - Check that the role was granted correctly
   - Ensure you're logged in with the right account

### Debug Queries:

```sql
-- Check if you have admin role
SELECT * FROM user_roles WHERE user_id = auth.uid();

-- Check all policies on articles table
SELECT * FROM pg_policies WHERE tablename = 'articles';

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('articles', 'user_roles');
```

## 📚 **Next Steps**

Once admin access is working:

1. **Set up user management interface** in your React app
2. **Add role-based UI components** (show/hide based on role)
3. **Implement audit logging** for admin actions
4. **Add role request workflow** for new users
5. **Set up automated role assignments** based on criteria

## 🎉 **Congratulations!**

You now have a secure, scalable admin system in Supabase with:

- ✅ **Database-driven roles** instead of hardcoded metadata
- ✅ **Proper RLS policies** based on user roles
- ✅ **Admin user management** capabilities
- ✅ **Secure role assignment** and revocation
- ✅ **Audit trail** for role changes
- ✅ **Scalable architecture** for future growth

Your Warm Corporate Canvas project now has enterprise-grade access control! 🚀

## 🆘 **Need Help?**

- Check the troubleshooting section above
- Review your SQL execution logs in Supabase
- Verify all policies and functions were created
- Test with a simple user first before scaling up
