CREATE OR REPLACE PROCEDURE dummy_schedule(routeID character varying, stationIds character varying[])
LANGUAGE plpgsql
AS $$
DECLARE
    timepoints_array time_point[];
    size_of_schedule integer;
    stationId character varying;
BEGIN
    -- Initialize an empty array
    timepoints_array := '{}';

    -- Generate and insert timepoints
    FOREACH stationId IN ARRAY stationIds
    LOOP
        -- Append a new timepoint to the array for each station
        timepoints_array := timepoints_array || ARRAY[ROW(stationId, NOW())::time_point];
    END LOOP;

    SELECT COUNT(*) INTO size_of_schedule FROM schedule;

    size_of_schedule := ((size_of_schedule::integer) + 1)::character varying;
    INSERT INTO schedule(id,                start_timestamp,route,  time_type,  time_list, travel_direction) 
    VALUES              (size_of_schedule,  NOW()          ,routeID,'morning',  timepoints_array, 'to_buet');

    size_of_schedule := ((size_of_schedule::integer) + 1)::character varying;
    INSERT INTO schedule(id,                start_timestamp,route,  time_type,  time_list, travel_direction) 
    VALUES              (size_of_schedule,  NOW()         ,routeID,'afternoon',  timepoints_array, 'from_buet');

    size_of_schedule := ((size_of_schedule::integer) + 1)::character varying;
    INSERT INTO schedule(id,                start_timestamp,route,  time_type,  time_list, travel_direction) 
    VALUES              (size_of_schedule,  NOW()          ,routeID,'evening',  timepoints_array, 'from_buet');
END;
$$;
