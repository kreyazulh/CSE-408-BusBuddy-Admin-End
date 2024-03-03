import random
import uuid

# Defining bus parts and their average prices in USD
bus_parts = [
    ("Engine Oil", 50), ("Tire", 120), ("Brake Pad", 35), 
    ("Wrench Set", 40), ("Screwdriver Set", 25), ("Air Filter", 20),
    ("Oil Filter", 15), ("Transmission Fluid", 30), ("Coolant", 28),
    ("Brake Fluid", 22), ("Fuel Pump", 140), ("Battery", 100),
    ("Headlights", 80), ("Taillights", 60), ("Windshield Wipers", 20),
    ("Seat Cover", 25), ("Floor Mats", 30), ("Mirror", 45),
    ("Steering Wheel Cover", 20), ("Exhaust", 150), ("Radiator", 130)
]

# Conversion rate from USD to BDT
usd_to_bdt = 125

# Generating dummy data
inventory_data = []

for i in range(len(bus_parts)):
    part_name, usd_price = bus_parts[i]
    amount = random.randint(1, 50)  # Random stock amount
    rate = round(usd_price * usd_to_bdt, 2)  # Convert price to BDT and round off
    inventory_data.append((str(uuid.uuid4())[:8], part_name, amount, rate))

# Formatting data into SQL insert statements
sql_commands = '\n'.join([f"INSERT INTO inventory (id, name, amount, rate) VALUES ('{id}', '{name}', {amount}, {rate});" for id, name, amount, rate in inventory_data])
print(sql_commands)
