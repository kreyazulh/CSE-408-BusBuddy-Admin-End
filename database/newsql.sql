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


--DROP PROCEDURE alloc_from_req(character varying,timestamp with time zone,character varying,character varying,character varying,character varying,character varying);
CREATE OR REPLACE PROCEDURE alloc_from_req(id1 bigint, start_time1 timestamptz, admin_id1 character varying, 
      bus_id1 character varying, driver1 character varying, collector1 character varying, remarks1 character varying)
LANGUAGE plpgsql
AS $$
DECLARE
	allocation_id1 INTEGER;
BEGIN
    INSERT INTO allocation( start_timestamp, bus,    is_default, driver,    approved_by, helper) 
                    VALUES (start_time1,      bus_id1, false,      driver1, admin_id1,       collector1) RETURNING id INTO allocation_id1;
    UPDATE requisition SET timestamp = start_time1, approved_by = admin_id1, remarks = remarks1, is_approved=true, allocation_id=allocation_id1 WHERE id = id1;

END;
$$;

CREATE OR REPLACE PROCEDURE update_allocation(on_day DATE, admin_id CHARACTER VARYING)
LANGUAGE plpgsql
AS $$
DECLARE
    schedule_record RECORD;
BEGIN
    FOR schedule_record IN SELECT * FROM schedule LOOP
		CALL create_allocation(schedule_record.id, on_day, schedule_record.default_bus, schedule_record.default_driver, schedule_record.default_helper, admin_id);
    END LOOP;
END;
$$;







CREATE OR REPLACE PROCEDURE random_assignment(admin_id character varying)
LANGUAGE plpgsql
AS $$
DECLARE
    n INTEGER;
    drivers character varying[];
    helpers character varying[];
    buses character varying[];
    i INTEGER;
    curr TIMESTAMP := CURRENT_TIMESTAMP;
    sched_record RECORD;
BEGIN
    -- Count the number of rows in the 'schedule' table
    SELECT COUNT(*) INTO n FROM schedule;

    -- Populate the drivers array with n IDs from 'staff' table where role is 'driver'
    SELECT ARRAY(SELECT id FROM bus_staff WHERE role = 'driver' ORDER BY random()) INTO drivers LIMIT n;

    -- Populate the helpers array with n IDs from 'staff' table where role is 'helper'
    SELECT ARRAY(SELECT id FROM bus_staff WHERE role = 'collector' ORDER BY random()) INTO helpers LIMIT n;

    -- Populate the buses array with n IDs from 'bus' table where capacity is greater than or equal to 50
    SELECT ARRAY(SELECT reg_id FROM bus WHERE capacity >= 30 ORDER BY random()) INTO buses LIMIT n;

    -- Update all records in 'assignment' table where end_time is null to current timestamp
    UPDATE assignment SET end_time = curr WHERE end_time IS NULL;

    i := 1;

    -- Iterate over all records in the 'schedule' table
    FOR sched_record IN SELECT * FROM schedule LOOP
        -- Find the schedule ID corresponding to the route and shift of the current iteration
        DECLARE
            schedule_id INTEGER;
        BEGIN
            schedule_id := sched_record.id;
            -- SELECT id INTO schedule_id FROM schedule WHERE route = (SELECT route FROM assignment WHERE id = i) AND shift = (SELECT shift FROM assignment WHERE id = i);

            -- Insert a new record into the 'assignment' table
            INSERT INTO assignment (route, shift, bus, driver, helper, start_time) 
            VALUES ((SELECT route FROM schedule WHERE id = schedule_id), 
                    (SELECT time_type FROM schedule WHERE id = schedule_id), 
                    buses[i], drivers[i], helpers[i], curr);
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                -- Handle the case where no corresponding schedule record is found
                RAISE NOTICE 'No schedule record found for route % and shift %', (SELECT route FROM assignment WHERE id = schedule_id), 
                (SELECT shift FROM assignment WHERE id = schedule_id);
        END;
        i := i+1;
    END LOOP;
END;
$$;









CREATE OR REPLACE PROCEDURE rotate_assignment(admin_id character varying)
LANGUAGE plpgsql
AS $$
DECLARE
    curr TIMESTAMP := CURRENT_TIMESTAMP;
    min_route_id INTEGER;
    new_route_id INTEGER;
    route_id_count INTEGER;
BEGIN
    -- Find the minimum route id being used in the 'assignment' table
    SELECT MIN(route) INTO min_route_id FROM assignment;

    LOOP
        -- Get the count of distinct route ids in the 'assignment' table
        SELECT COUNT(DISTINCT route) INTO route_id_count FROM assignment;

        -- If there are no records with end_time null, exit the loop
        IF NOT EXISTS (SELECT 1 FROM assignment WHERE end_time IS NULL) THEN
            EXIT;
        END IF;

        -- Find the next route id, considering the minimum route id
        IF min_route_id IS NOT NULL THEN
            SELECT COALESCE(MIN(route), min_route_id) INTO new_route_id FROM assignment WHERE end_time IS NULL AND route > min_route_id;
        ELSE
            SELECT MIN(route) INTO new_route_id FROM assignment WHERE end_time IS NULL;
        END IF;

        -- If no next route id found, set the new route id to the minimum route id
        IF new_route_id IS NULL THEN
            new_route_id := min_route_id;
        END IF;

        -- Add a new row with the same details as the one having end_time null, but with updated start_time
        INSERT INTO assignment (route, shift, bus, driver, helper, start_time, end_time)
        SELECT route, shift, bus, driver, helper, curr, NULL
        FROM assignment
        WHERE end_time IS NULL AND route = new_route_id;

        -- Update the end_time of the old row to the current timestamp
        UPDATE assignment SET end_time = curr WHERE end_time IS NULL AND route = new_route_id;

        -- Set the minimum route id to the new route id for the next iteration
        min_route_id := new_route_id;
    END LOOP;
END;
$$;
