-- Create a function to execute read-only SQL queries
-- This allows the application to run dynamically generated SQL
-- while maintaining security by only allowing SELECT queries

CREATE OR REPLACE FUNCTION execute_readonly_sql(query_text text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_row json;
BEGIN
    -- Validate that the query is a SELECT statement
    IF UPPER(TRIM(query_text)) NOT LIKE 'SELECT%' THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;

    -- Check for dangerous keywords
    IF query_text ~* '\b(DROP|DELETE|INSERT|UPDATE|TRUNCATE|ALTER|CREATE|GRANT|REVOKE)\b' THEN
        RAISE EXCEPTION 'Query contains forbidden keywords';
    END IF;

    -- Execute the query and return results as JSON
    RETURN QUERY EXECUTE format('
        SELECT row_to_json(t.*)
        FROM (%s) t
    ', query_text);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_readonly_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION execute_readonly_sql(text) TO service_role;

-- Add a comment explaining the function
COMMENT ON FUNCTION execute_readonly_sql(text) IS
'Executes read-only SQL queries and returns results as JSON.
Only SELECT statements are allowed. Used by LOIS to execute LLM-generated queries.';
